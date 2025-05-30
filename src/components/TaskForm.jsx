import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'

const TaskForm = ({ isOpen, onClose, onSubmit, editingTask, projects }) => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: '1',
    status: 'pending'
  })

  useEffect(() => {
    if (editingTask) {
      setTaskForm({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        projectId: editingTask.projectId,
        status: editingTask.status
      })
    } else {
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        projectId: '1',
        status: 'pending'
      })
    }
  }, [editingTask, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      return
    }
    onSubmit(taskForm)
    onClose()
  }

  const handleClose = () => {
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
// Combine date and time for submission
    let dueDate = null
    if (formData.dueDate) {
      dueDate = new Date(formData.dueDate)
      if (formData.dueTime) {
        const [hours, minutes] = formData.dueTime.split(':')
        dueDate.setHours(parseInt(hours), parseInt(minutes), 0)
      }
      dueDate = dueDate.toISOString()
    }
onSubmit({ ...formData, dueDate })
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
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
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                        <option value="pending">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Done</option>
                      </select>
{/* Due Time Field */}
            {formData.dueDate && (
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Due Time
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  className="input-field"
                />
              </div>
            )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
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
  )
}

export default TaskForm