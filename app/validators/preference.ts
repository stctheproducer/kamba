// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
import vine from '@vinejs/vine'

export const upsertPreferenceValidator = vine.compile(
  vine.object({
    sidebarCollapsed: vine.boolean(),
    params: vine.object({
      preferenceId: vine.enum(['sidebar-collapsed']),
    }),
  })
)

export const getPreferenceValidator = vine.compile(
  vine.object({
    params: vine.object({
      preferenceId: vine.enum(['sidebar-collapsed']),
    }),
  })
)
