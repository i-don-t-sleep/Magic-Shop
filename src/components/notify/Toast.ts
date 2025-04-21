'use client'

import toast from 'react-hot-toast'
import { motion } from 'framer-motion' //npm install framer-motion

const MAX_TOAST = 1
const toastQueue: string[] = []

export const showSuccessToast = (message: string) => {
  removeOldToastIfNeeded()
  const id = toast.success(message)
  toastQueue.unshift(id)
}

export const showErrorToast = (message: string) => {
  removeOldToastIfNeeded()
  const id = toast.error(message)
  toastQueue.unshift(id)
}

export const showLoadingToast = (message: string) => {
  removeOldToastIfNeeded()
  const id = toast.loading(message)
  toastQueue.unshift(id)
}

function removeOldToastIfNeeded() {
  if (toastQueue.length >= MAX_TOAST) {
    const oldestId = toastQueue.pop()
    if (oldestId) toast.dismiss(oldestId)
  }
}

/*'use client'

import toast from 'react-hot-toast'
import { motion } from 'framer-motion' //npm install framer-motion

const MAX_TOAST = 1
const toastQueue: string[] = []

export const showSuccessToast = (message: string) => {
  removeOldToastIfNeeded()
  const id = toast.success(message)
  toastQueue.unshift(id)
}

export const showErrorToast = (message: string) => {
  removeOldToastIfNeeded()
  const id = toast.error(message)
  toastQueue.unshift(id)
}

export const showLoadingToast = (message: string) => {
  removeOldToastIfNeeded()
  const id = toast.loading(message)
  toastQueue.unshift(id)
}

function removeOldToastIfNeeded() {
  if (toastQueue.length >= MAX_TOAST) {
    const oldestId = toastQueue.pop()
    if (oldestId) toast.dismiss(oldestId)
  }
}*/

/*
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const MAX_TOAST = 5
const toastQueue: string[] = [] // เก็บ toast id ที่แสดงอยู่

const createSwipeableToast = (message: string, type: 'success' | 'error' | 'loading') => {
  removeOldToastIfNeeded()
  const id = toast.custom((t) => (
    <motion.div
      dsrag="x"
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
          toast.dismiss(t.id)
        }
      }}
      className="bg-zinc-900 text-white px-4 py-2 rounded shadow-lg max-w-xs cursor-pointer"
    >
      {message}
    </motion.div>
  ), { duration: type === 'loading' ? Infinity : 4000 })
  toastQueue.unshift(id)
}

export const showSuccessToast = (message: string) => {
  createSwipeableToast(message, 'success')
}

export const showErrorToast = (message: string) => {
  createSwipeableToast(message, 'error')
}

export const showLoadingToast = (message: string) => {
  createSwipeableToast(message, 'loading')
}

function removeOldToastIfNeeded() {
  if (toastQueue.length >= MAX_TOAST) {
    const oldestId = toastQueue.pop()
    if (oldestId) toast.dismiss(oldestId)
  }
}
export const showSuccessToast = (message: string) => {
  createSwipeableToast(message, 'success')
}

export const showErrorToast = (message: string) => {
  createSwipeableToast(message, 'error')
}

export const showLoadingToast = (message: string) => {
  createSwipeableToast(message, 'loading')
}

function removeOldToastIfNeeded() {
  if (toastQueue.length >= MAX_TOAST) {
    const oldestId = toastQueue.pop()
    if (oldestId) toast.dismiss(oldestId)
  }
}
*/