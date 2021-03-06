import React, { useEffect, useState } from 'react'
import './transitions.css'
import { useSelector, useDispatch } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
import { Tooltip } from 'components/Tooltip'
import Chip from '@material-ui/core/Chip'
import Box from '@material-ui/core/Box'
import pluralize from 'helpers/pluralize'
import Confirm from 'components/Confirm'
import TagSelect2 from 'components/TagSelect2'
import {
  deleteTransactions,
  setTagsToTransactions,
} from 'store/localData/transactions/thunks'
import { CSSTransition } from 'react-transition-group'
import { EditOutlined } from '@material-ui/icons'
import BulkEditModal from './BulkEditModal'
import { getType } from 'store/localData/transactions/helpers'
import { getTransactions } from 'store/localData/transactions'

export default function Actions({
  visible,
  checkedIds,
  onUncheckAll,
  onDelete,
}) {
  const dispatch = useDispatch()
  const allTransactions = useSelector(getTransactions)
  const [ids, setIds] = useState(checkedIds)
  const transactions = ids?.map(id => allTransactions[id])
  const actions = getAvailableActions(transactions)
  const length = ids.length
  const [editModalVisible, setEditModalVisible] = useState(false)

  useEffect(() => {
    if (visible) setIds(checkedIds)
  }, [visible, checkedIds])

  const handleSetTag = id => {
    if (!id || id === 'null') dispatch(setTagsToTransactions(checkedIds, []))
    else dispatch(setTagsToTransactions(checkedIds, [id]))
    onUncheckAll()
  }

  const handleDelete = () => {
    dispatch(deleteTransactions(checkedIds))
    onUncheckAll()
  }

  const chipText =
    pluralize(length, ['Выбрана', 'Выбрано', 'Выбрано']) +
    ` ${length} ` +
    pluralize(length, ['операция', 'операции', 'операций'])

  const deleteText = `Удалить ${length} ${pluralize(length, [
    'операцию',
    'операции',
    'операций',
  ])}?`

  return (
    <>
      <BulkEditModal
        ids={checkedIds}
        onClose={() => setEditModalVisible(false)}
        onApply={() => {
          setEditModalVisible(false)
          onUncheckAll()
        }}
        open={editModalVisible}
      />

      <Box
        position="absolute"
        left="50%"
        bottom={16}
        style={{ transform: 'translateX(-50%)' }}
        zIndex={1000}
      >
        <CSSTransition
          mountOnEnter
          unmountOnExit
          in={visible}
          timeout={200}
          classNames="actions-transition"
        >
          <Box
            display="flex"
            alignItems="center"
            paddingLeft={1}
            bgcolor="info.main"
            boxShadow="4"
            borderRadius="60px"
          >
            <Chip label={chipText} onDelete={onUncheckAll} variant="outlined" />

            <Confirm
              title={deleteText}
              onOk={handleDelete}
              okText="Удалить"
              cancelText="Оставить"
            >
              <Tooltip title="Удалить выбранные">
                <IconButton children={<DeleteOutlineIcon />} />
              </Tooltip>
            </Confirm>

            {actions.setMainTag && (
              <TagSelect2
                onChange={handleSetTag}
                trigger={
                  <Tooltip title="Выставить категорию">
                    <IconButton children={<LocalOfferOutlinedIcon />} />
                  </Tooltip>
                }
              />
            )}

            {actions.bulkEdit && (
              <Tooltip title="Редактировать">
                <IconButton
                  children={<EditOutlined />}
                  onClick={() => setEditModalVisible(true)}
                />
              </Tooltip>
            )}
          </Box>
        </CSSTransition>
      </Box>
    </>
  )
}

function getAvailableActions(transactions) {
  const { income, outcome, transfer } = getTypes(transactions)
  return {
    delete: true,
    setMainTag: !transfer && (income || outcome),
    bulkEdit: !transfer && (income || outcome),
  }
}

function getTypes(list = []) {
  let res = { income: 0, outcome: 0, transfer: 0 }
  list?.forEach(tr => res[getType(tr)]++)
  return res
}
