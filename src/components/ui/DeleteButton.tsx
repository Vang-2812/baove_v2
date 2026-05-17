'use client'

import * as React from 'react'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteButtonProps {
  onConfirm: () => Promise<any>
  confirmMessage?: string
}

export function DeleteButton({ onConfirm, confirmMessage = 'Bạn có chắc chắn muốn xóa không?' }: DeleteButtonProps) {
  const [isPending, startTransition] = React.useTransition()

  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      startTransition(async () => {
        try {
          await onConfirm()
        } catch (error) {
          console.error('Delete failed:', error)
          alert('Có lỗi xảy ra khi thực hiện xóa.')
        }
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/10 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center w-8 h-8"
      title="Xóa"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  )
}
