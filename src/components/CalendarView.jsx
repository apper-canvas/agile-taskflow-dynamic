import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, getDay } from 'date-fns'
import ApperIcon from './ApperIcon'
import TaskCard from './TaskCard'

const CalendarView = ({ tasks, projects, onEditTask, onDeleteTask, onUpdateTaskStatus, onRescheduleTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverDate, setDragOverDate] = useState(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add padding days for complete weeks
  const startPadding = getDay(monthStart)
  const paddingDays = Array.from({ length: startPadding }, (_, i) => {
    const date = new Date(monthStart)
    date.setDate(date.getDate() - (startPadding - i))
    return date
  })

  const endPadding = 6 - getDay(monthEnd)
  const endPaddingDays = Array.from({ length: endPadding }, (_, i) => {
    const date = new Date(monthEnd)
    date.setDate(date.getDate() + (i + 1))
    return date
  })

  const allDays = [...paddingDays, ...calendarDays, ...endPaddingDays]

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), date)
    })
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
  }

  const handleDragOver = (e, date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverDate(date)
  }

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the calendar day entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDate(null)
    }
  }

  const handleDrop = (e, date) => {
    e.preventDefault()
    if (draggedTask && !isSameDay(new Date(draggedTask.dueDate || new Date()), date)) {
      const newDueDate = new Date(date)
      // Preserve the time if it exists
      if (draggedTask.dueDate) {
        const originalDate = new Date(draggedTask.dueDate)
        newDueDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds())
      } else {
        newDueDate.setHours(9, 0, 0) // Default to 9 AM
      }
      onRescheduleTask(draggedTask.id, newDueDate.toISOString())
    }
    setDraggedTask(null)
    setDragOverDate(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverDate(null)
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1))
  }

  const isCurrentMonth = (date) => {
    return date >= monthStart && date <= monthEnd
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft border border-surface-200 dark:border-surface-700 overflow-hidden"
    >
      {/* Calendar Header */}
      <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
            >
              Today
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 sm:p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-surface-600 dark:text-surface-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 auto-rows-fr">
          {allDays.map((date, index) => {
            const dayTasks = getTasksForDate(date)
            const isCurrentMonthDay = isCurrentMonth(date)
            const isDragOver = dragOverDate && isSameDay(dragOverDate, date)
            const isTaskBeingDragged = draggedTask && dayTasks.some(task => task.id === draggedTask.id)

            return (
              <motion.div
                key={index}
                className={`calendar-day min-h-[100px] p-2 border border-surface-200 dark:border-surface-700 rounded-lg ${
                  isCurrentMonthDay 
                    ? 'bg-white dark:bg-surface-800' 
                    : 'bg-surface-50 dark:bg-surface-900 opacity-50'
                } ${
                  isToday(date) ? 'ring-2 ring-primary ring-opacity-50' : ''
                } ${
                  isDragOver ? 'bg-primary bg-opacity-10 border-primary' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
                whileHover={{ scale: isCurrentMonthDay ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Date Number */}
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentMonthDay 
                    ? isToday(date) 
                      ? 'text-primary' 
                      : 'text-surface-900 dark:text-surface-100'
                    : 'text-surface-400 dark:text-surface-600'
                }`}>
                  {format(date, 'd')}
                </div>

                {/* Tasks for this date */}
                <div className="space-y-1">
                  {dayTasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId)
                    const isDragging = draggedTask && draggedTask.id === task.id
                    
                    return (
                      <motion.div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`calendar-task-card ${isDragging ? 'dragging' : ''}`}
                        whileHover={{ scale: isDragging ? 1 : 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`p-2 rounded text-xs cursor-move ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        } ${
                          task.status === 'completed' ? 'line-through opacity-60' : ''
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="truncate font-medium">{task.title}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditTask(task)
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:text-primary transition-all duration-200"
                              >
                                <ApperIcon name="Edit" className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                          {task.dueDate && (
                            <div className="text-xs opacity-75 mt-1">
                              {format(new Date(task.dueDate), 'h:mm a')}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Drop indicator */}
                {isDragOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 p-2 border-2 border-dashed border-primary rounded text-center text-xs text-primary"
                  >
                    Drop here to reschedule
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default CalendarView