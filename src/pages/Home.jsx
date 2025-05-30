import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-purple-50 to-blue-50 dark:from-surface-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-white bg-opacity-80 dark:bg-surface-900 dark:bg-opacity-80 border-b border-surface-200 dark:border-surface-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckSquare" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">TaskFlow</h1>
            </motion.div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2 rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-200"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>Quick Add</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3 sm:mb-4">
            Organize Your Tasks with{' '}
            <span className="text-gradient">Intelligence</span>
          </h2>
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            Transform your productivity with smart task management, intuitive organization, and seamless collaboration.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {[
            { icon: "CheckCircle2", label: "Completed", value: "24", color: "text-green-500" },
            { icon: "Clock", label: "In Progress", value: "8", color: "text-blue-500" },
            { icon: "AlertCircle", label: "Pending", value: "12", color: "text-orange-500" },
            { icon: "Calendar", label: "Due Today", value: "3", color: "text-red-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="task-card p-4 sm:p-6 text-center group cursor-pointer"
            >
              <ApperIcon 
                name={stat.icon} 
                className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200`} 
              />
              <div className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Feature Component */}
        <MainFeature />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 sm:mt-12"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4 sm:mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { icon: "Plus", label: "New Task", color: "bg-primary" },
              { icon: "FolderPlus", label: "New Project", color: "bg-secondary" },
              { icon: "Users", label: "Team Tasks", color: "bg-accent" },
              { icon: "Calendar", label: "Schedule", color: "bg-purple-500" },
              { icon: "BarChart3", label: "Analytics", color: "bg-green-500" },
              { icon: "Settings", label: "Settings", color: "bg-surface-500" }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="task-card p-3 sm:p-4 text-center group hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} rounded-xl mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <ApperIcon name={action.icon} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-300">
                  {action.label}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Home