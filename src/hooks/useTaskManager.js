import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export const useTaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([
    { id: '1', name: 'Personal', color: 'bg-blue-500', taskCount: 0 },
    { id: '2', name: 'Work', color: 'bg-purple-500', taskCount: 0 },
    { id: '3', name: 'Shopping', color: 'bg-green-500', taskCount: 0 }
  ])

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

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
    toast.success('Task created successfully!')
    return newTask
  }

  const updateTask = (taskId, taskData) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
        : task
    ))
    toast.success('Task updated successfully!')
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ))
    toast.success(`Task marked as ${newStatus}!`)
  }

  const getFilteredAndSortedTasks = (selectedProject, filterStatus, sortBy) => {
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

  return {
    tasks,
    projects,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getFilteredAndSortedTasks
  }
}