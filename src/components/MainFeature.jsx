import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast, isFuture } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([
    { id: '1', name: 'Personal', color: 'bg-blue-500', taskCount: 0 },
    { id: '2', name: 'Work', color: 'bg-purple-500', taskCount: 0 },
    { id: '3', name: 'Shopping', color: 'bg-green-500', taskCount: 0 }
  ])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState('all')
  const [viewMode, setViewMode] = useState('list') // list, board, calendar
  const [sortBy, setSortBy] = useState('dueDate') // dueDate, priority, created
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, in-progress, completed
  const [editingTask, setEditingTask] = useState(null)

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: '1',
    status: 'pending'
  })

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
    updateProjectCounts()
  }, [tasks])

  const updateProjectCounts = () => {
    setProjects(prev => prev.map(project => ({
      ...project,
      taskCount: tasks.filter(task => task.projectId === project.id).length
    })))
  }

  const handleSubmitTask = (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    const newTask = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      ...taskForm,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTask) {
      setTasks(prev => prev.map(task => task.id === editingTask.id ? newTask : task))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      setTasks(prev => [...prev, newTask])
      toast.success('Task created successfully!')
    }

    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      projectId: '1',
      status: 'pending'
    })
    setShowTaskForm(false)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ))
    toast.success(`Task marked as ${newStatus}!`)
  }

  const handleEditTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      status: task.status
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks

    // Filter by project
    if (selectedProject !== 'all') {
      filtered = filtered.filter(task => task.projectId === selectedProject)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus)
    }

    // Sort tasks
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'dueDate':
        default:
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
      }
    })
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

  const filteredTasks = getFilteredAndSortedTasks()

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
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowTaskForm(false)
              setEditingTask(null)
              setTaskForm({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                projectId: '1',
                status: 'pending'
              })
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowTaskForm(false)
                      setEditingTask(null)
                    }}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmitTask} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter task title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field min-h-[100px] resize-none"
                      placeholder="Add task description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="input-field"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Project
                      </label>
                      <select
                        value={taskForm.projectId}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
                        className="input-field"
                      >
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    {editingTask && (
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Status
                        </label>
                        <select
                          value={taskForm.status}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, status: e.target.value }))}
                          className="input-field"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowTaskForm(false)
                        setEditingTask(null)
                      }}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks Display */}
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
              <AnimatePresence>
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
                        {/* Task Status Toggle */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const newStatus = task.status === 'completed' ? 'pending' : 'completed'
                            handleUpdateTaskStatus(task.id, newStatus)
                          }}
                          className="self-start sm:self-center"
                        >
                          <ApperIcon 
                            name={getStatusIcon(task.status)} 
                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${
                              task.status === 'completed' 
                                ? 'text-green-500' 
                                : 'text-surface-400 hover:text-surface-600'
                            }`}
                          />
                        </motion.button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mb-2">
                            <h4 className={`font-medium text-surface-900 dark:text-surface-100 ${
                              task.status === 'completed' ? 'line-through opacity-60' : ''
                            }`}>
                              {task.title}
                            </h4>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Priority Badge */}
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              }`}>
                                <ApperIcon name={getPriorityIcon(task.priority)} className="w-3 h-3" />
                                {task.priority}
                              </div>

                              {/* Project Badge */}
                              <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${project?.color || 'bg-surface-500'}`}>
                                {project?.name || 'Unknown'}
                              </div>
                            </div>
                          </div>

                          {task.description && (
                            <p className={`text-sm text-surface-600 dark:text-surface-400 mb-2 ${
                              task.status === 'completed' ? 'line-through opacity-60' : ''
                            }`}>
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                            {task.dueDate && (
                              <div className={`flex items-center gap-1 ${getTaskStatusColor(task)}`}>
                                <ApperIcon name="Calendar" className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>
                                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                                  {isToday(new Date(task.dueDate)) && ' (Today)'}
                                  {isPast(new Date(task.dueDate)) && task.status !== 'completed' && ' (Overdue)'}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400">
                              <ApperIcon name="Clock" className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{format(new Date(task.createdAt), 'MMM dd')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditTask(task)}
                            className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors duration-200"
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-surface-600 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MainFeature