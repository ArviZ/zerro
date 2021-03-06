import { getRootUser } from 'store/serverData'
import { setAccount } from 'store/localData/accounts'
import { makeDataAcc, makeDataReminder } from './helpers'
import { getDataReminders, getDataAccountId } from './selectors'
import { DataRemindeType } from './constants'
import { setReminder } from 'store/localData/reminders'
import { AppDispatch, AppThunk, AppGetState } from 'store'

export const setHiddenData = (type: DataRemindeType, data: any): AppThunk => (
  dispatch,
  getState
) => {
  dispatch(prepareData)
  const state = getState()
  const user = getRootUser(state)?.id
  if (!user) return
  const dataAcc = getDataAccountId(state) as string
  const reminder =
    getDataReminders(state)[type] || makeDataReminder(user, dataAcc, type)
  dispatch(
    setReminder({
      ...reminder,
      comment: JSON.stringify(data),
      changed: Date.now(),
    })
  )
}

function prepareData(dispatch: AppDispatch, getState: AppGetState) {
  let state = getState()
  const user = getRootUser(state)?.id
  if (!user) return
  // If no data account create one
  let dataAccId = getDataAccountId(state)
  if (!dataAccId) {
    const acc = makeDataAcc(user)
    dispatch(setAccount(acc))
    dataAccId = acc.id
  }
}
