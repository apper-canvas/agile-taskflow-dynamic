import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'
import TaskForm from './TaskForm'
import TaskCard from './TaskCard'
import KanbanBoard from './KanbanBoard'
import CalendarView from './CalendarView'
import { useTaskManager } from '../hooks/useTaskManager'

const MainFeature = () => {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState('all')
  const [viewMode, setViewMode] = useState('list') // list, board, calendar
  const [sortBy, setSortBy] = useState('dueDate') // dueDate, priority, created
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, in-progress, completed
  const [editingTask, setEditingTask] = useState(null)

  const {
    tasks,
    projects,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getFilteredAndSortedTasks
  } = useTaskManager()
rescheduleTask

  const handleSubmitTask = (taskData) => {
    if (!taskData.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    if (editingTask) {
      updateTask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      createTask(taskData)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const getTaskStatusColor = (task) => {
    if (task.status === 'completed') return 'text-green-600 dark:text-green-400'
    if (task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed') {
      return 'text-red-600 dark:text-red-400'
    }
    if (task.dueDate && isToday(new Date(task.dueDate))) {
      return 'text-orange-600 dark:text-orange-400'
    }
    return 'text-surface-600 dark:text-surface-400'
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle'
      case 'medium': return 'Minus'
      case 'low': return 'ArrowDown'
      default: return 'Minus'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle2'
      case 'in-progress': return 'Clock'
      default: return 'Circle'
    }
  }

  const filteredTasks = getFilteredAndSortedTasks(selectedProject, filterStatus, sortBy)

  const renderContent = () => {
if (viewMode === 'calendar') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="min-h-[600px]"
        >
          <CalendarView
            tasks={filteredTasks}
            projects={projects}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
            onUpdateTaskStatus={updateTaskStatus}
            onRescheduleTask={rescheduleTask}
          />
        </motion.div>
      )
    }
    if (viewMode === 'board') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="min-h-[600px]"
        >
          <KanbanBoard
            tasks={filteredTasks}
            projects={projects}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
            onUpdateTaskStatus={updateTaskStatus}
          />
        </motion.div>
      )
    }

    // List view (existing implementation)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft border border-surface-200 dark:border-surface-700 overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100">
            Tasks ({filteredTasks.length})
          </h3>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <ApperIcon name="CheckSquare" className="w-16 h-16 sm:w-20 sm:h-20 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
              <h4 className="text-lg sm:text-xl font-medium text-surface-600 dark:text-surface-400 mb-2">
                No tasks found
              </h4>
              <p className="text-surface-500 dark:text-surface-500 mb-6">
                Create your first task to get started with TaskFlow
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskForm(true)}
                className="btn-primary"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Task
              </motion.button>
            </div>
          ) : (
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredTasks.map((task, index) => {
                const project = projects.find(p => p.id === task.projectId)
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-4 sm:p-6 hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors duration-200 ${
                      task.priority === 'high' ? 'priority-high' : 
                      task.priority === 'medium' ? 'priority-medium' : 'priority-low'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <TaskCard
                        task={task}
                        project={project}
                        onEdit={handleEditTask}
                        onDelete={deleteTask}
                        onStatusChange={updateTaskStatus}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
      >
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskForm(true)}
            className="btn-primary flex items-center space-x-2 text-sm sm:text-base"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Task</span>
          </motion.button>
          
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input-field text-sm py-2 px-3 min-w-0 sm:min-w-[120px]"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.taskCount})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg bg-surface-100 dark:bg-surface-800 p-1">
            {[
              { mode: 'list', icon: 'List' },
              { mode: 'board', icon: 'Columns' },
              { mode: 'calendar', icon: 'Calendar' }
            ].map(({ mode, icon }) => (
              <motion.button
                key={mode}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === mode 
                    ? 'bg-white dark:bg-surface-700 text-primary shadow-sm' 
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                }`}
              >
                <ApperIcon name={icon} className="w-4 h-4" />
              </motion.button>
            ))}
          </div>

          {/* Sort and Filter */}
          {viewMode !== 'board' && (
            <>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-sm py-2 px-3 min-w-0 sm:min-w-[100px]"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="created">Created</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field text-sm py-2 px-3 min-w-0 sm:min-w-[100px]"
              >
                <option value="all">All Status</option>
                <option value="pending">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            </>
          )}
        </div>
      </motion.div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        projects={projects}
      />

      {/* Content Display */}
      {renderContent()}
    </div>
  )
}

export default MainFeature