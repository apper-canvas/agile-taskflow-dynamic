import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns'
import ApperIcon from './ApperIcon'

const CalendarView = ({ tasks, projects, onEditTask, onDeleteTask, onRescheduleTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [draggedTask, setDraggedTask] = useState(null)
  const [draggedOverDate, setDraggedOverDate] = useState(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    )
  }

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOverDate(date)
  }

  const handleDragLeave = () => {
    setDraggedOverDate(null)
  }

  const handleDrop = (e, date) => {
    e.preventDefault()
    if (draggedTask && !isSameDay(new Date(draggedTask.dueDate), date)) {
      // Preserve the original time, just change the date
      const originalDate = new Date(draggedTask.dueDate)
      const newDate = new Date(date)
      newDate.setHours(originalDate.getHours())
      newDate.setMinutes(originalDate.getMinutes())
      
      onRescheduleTask(draggedTask.id, newDate.toISOString())
    }
    setDraggedTask(null)
    setDraggedOverDate(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDraggedOverDate(null)
  }

  // Get weekday headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="calendar-container bg-white dark:bg-surface-800 rounded-2xl shadow-soft border border-surface-200 dark:border-surface-700 overflow-hidden">
      {/* Calendar Header */}
      <div className="calendar-header p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark"
            >
              Today
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Weekday Headers */}
        <div className="calendar-weekdays grid grid-cols-7 border-b border-surface-200 dark:border-surface-700">
          {weekDays.map(day => (
            <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-900">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-days grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayTasks = getTasksForDate(date)
            const isCurrentMonth = isSameMonth(date, currentDate)
            const isTodayDate = isToday(date)
            const isDraggedOver = draggedOverDate && isSameDay(draggedOverDate, date)

            return (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className={`calendar-day min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-r border-b border-surface-200 dark:border-surface-700 last:border-r-0 ${
                  isCurrentMonth ? 'bg-white dark:bg-surface-800' : 'bg-surface-50 dark:bg-surface-900 opacity-50'
                } ${isTodayDate ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''} ${
                  isDraggedOver ? 'bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-20' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
              >
                {/* Date Number */}
                <div className={`text-xs sm:text-sm font-medium mb-1 ${
                  isTodayDate 
                    ? 'text-primary font-bold' 
                    : isCurrentMonth 
                      ? 'text-surface-900 dark:text-surface-100' 
                      : 'text-surface-400 dark:text-surface-600'
                }`}>
                  {format(date, 'd')}
                </div>

                {/* Tasks for this date */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => {
                    const project = projects.find(p => p.id === task.projectId)
                    const isDragging = draggedTask?.id === task.id
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
                        className={`calendar-task-card p-1 sm:p-2 rounded text-xs cursor-grab hover:cursor-grab active:cursor-grabbing ${
                          project?.color || 'bg-surface-500'
                        } text-white shadow-sm hover:shadow-md transition-all duration-200 ${
                          task.status === 'completed' ? 'opacity-60 line-through' : ''
                        } ${isDragging ? 'transform rotate-2 scale-105' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onEditTask(task)}
                      >
                        <div className="font-medium truncate" title={task.title}>
                          {task.title}
                        </div>
                        {task.dueDate && (
                          <div className="text-xs opacity-80">
                            {format(new Date(task.dueDate), 'HH:mm')}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                  
                  {/* Show count if more tasks */}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-surface-500 dark:text-surface-400 pl-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CalendarView