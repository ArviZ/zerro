import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { Tooltip } from 'components/Tooltip'
import { Amount } from '../../../components/Amount'

type TotalProps = {
  name: string
  value: number
  align?: 'center' | 'right' | 'left'
  currency?: string
  sign?: boolean
  [x: string]: any
}

export function Total({
  align = 'center',
  name = '',
  value = 0,
  currency,
  sign = false,
  ...rest
}: TotalProps) {
  return (
    <Box {...rest}>
      <Typography
        align={align}
        variant="body2"
        color="textSecondary"
        children={name}
      />
      <Typography
        align={align}
        variant="h5"
        color={value ? 'textPrimary' : 'textSecondary'}
      >
        <Amount value={value} currency={currency} sign={sign} />
      </Typography>
    </Box>
  )
}

type LineProps = {
  name: string
  amount: number
  description: string
  currency?: string
  [x: string]: any
}

export function Line({
  name,
  amount,
  description,
  currency,
  ...rest
}: LineProps) {
  return (
    <Box display="flex" flexDirection="row" {...rest}>
      <Box flexGrow="1" mr={1} minWidth={0}>
        {description ? (
          <Tooltip title={description}>
            <Typography noWrap variant="body2" children={name} />
          </Tooltip>
        ) : (
          <Typography noWrap variant="body2" children={name} />
        )}
      </Box>
      <Typography variant="body2">
        <Amount value={amount} currency={currency} />
      </Typography>
    </Box>
  )
}
