import { motion } from 'framer-motion'
import { format, isToday, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const TaskCard = ({ task, project, onEdit, onDelete, onStatusChange, className = '' }) => {
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-todo'
      case 'in-progress': return 'status-in-progress'
      case 'completed': return 'status-completed'
      default: return 'status-todo'
    }
  }

  return (
    <div className={`kanban-card ${getStatusClass(task.status)} ${className}`}>
      <div className="flex items-start gap-3">
        {/* Task Status Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed'
            onStatusChange(task.id, newStatus)
          }}
          className="mt-1"
        >
          <ApperIcon 
            name={getStatusIcon(task.status)} 
            className={`w-5 h-5 transition-colors duration-200 ${
              task.status === 'completed' 
                ? 'text-green-500' 
                : 'text-surface-400 hover:text-surface-600'
            }`}
          />
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`font-medium text-surface-900 dark:text-surface-100 text-sm ${
              task.status === 'completed' ? 'line-through opacity-60' : ''
            }`}>
              {task.title}
            </h4>
            
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-600 dark:text-surface-400"
              >
                <ApperIcon name="Edit" className="w-3 h-3" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-surface-600 dark:text-surface-400 hover:text-red-600"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </motion.button>
            </div>
          </div>

          {task.description && (
            <p className={`text-xs text-surface-600 dark:text-surface-400 mb-2 line-clamp-2 ${
              task.status === 'completed' ? 'line-through opacity-60' : ''
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Priority Badge */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              }`}>
                <ApperIcon name={getPriorityIcon(task.priority)} className="w-2 h-2" />
                {task.priority}
              </div>

              {/* Project Badge */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${project?.color || 'bg-surface-500'}`}>
                {project?.name || 'Unknown'}
              </div>
            </div>
          </div>

          {task.dueDate && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${getTaskStatusColor(task)}`}>
              <ApperIcon name="Calendar" className="w-3 h-3" />
              <span>
                {format(new Date(task.dueDate), 'MMM dd')}
                {isToday(new Date(task.dueDate)) && ' (Today)'}
                {isPast(new Date(task.dueDate)) && task.status !== 'completed' && ' (Overdue)'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard