import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../../../..'
import { Checkbox, Form, DatePicker, ConfigProvider } from 'antd'
import { INewTask, ITask } from '../../types'
import { getDateUTC } from '../../../../utils/utils'
import { Button } from '../../../../components/Button/Button'
import dayjs from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import ru_RU from 'antd/lib/locale/ru_RU'

interface IProps {
  task?: ITask
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

export const Modal: React.FC<IProps> = observer((props) => {
  const { task, isModalOpen, setIsModalOpen } = props

  const { tasksStore } = useStore()

  const [form] = Form.useForm<INewTask>()

  const [isWithoutDate, setIsWithoutDate] = useState(false)

  useEffect(() => {
    form.resetFields()
    setIsWithoutDate(!!task?.date)
    if (task) {
      form.setFieldValue('title', task.title)
      form.setFieldValue('date', dayjs(task.date))
      form.setFieldValue('isImportant', task.isImportant)
    }
  }, [isModalOpen, task?.id]) // eslint-disable-line

  const onSubmit = async () => {
    const newTask: INewTask = form.getFieldsValue()

    newTask.date = isWithoutDate || !newTask.date ? undefined : getDateUTC(newTask.date)

    let isSuccess
    if (!task) {
      isSuccess = await tasksStore.createTask(newTask)
    } else {
      isSuccess = await tasksStore.updateTask(task.id, newTask)
    }

    if (isSuccess) {
      tasksStore.fetchTasks()
      // const tasks = [createdTask, ...tasksStore.tasks]
      // tasksStore.setTasks(tasks)
      form.resetFields()
      setIsModalOpen(false)
      tasksStore.setExpanded(null)
    }
  }

  return (
    <>
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.header}>
            {!task ? 'Новая задача' : 'Редактирование'}
            <div onClick={() => setIsModalOpen(false)}>
              <CloseOutlined style={{ color: 'var(--white)', fontSize: '18px' }} />
            </div>
          </div>

          <div className={style.body}>
            <Form
              name='basic'
              style={{ width: '100%' }}
              initialValues={{ remember: true }}
              form={form}
              onFinish={onSubmit}
            >
              <Form.Item<INewTask> name='title' rules={[{ required: true, message: 'Обязательное поле' }]}>
                <TextArea autoSize={{ minRows: 3, maxRows: 3 }} placeholder='Описание задачи' />
              </Form.Item>

              <ConfigProvider locale={ru_RU}>
                <Form.Item<INewTask>
                  name='date'
                  initialValue={dayjs()}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <DatePicker
                    placeholder='Дата'
                    format={'DD.MM.YYYY'}
                    minDate={dayjs()}
                    disabled={isWithoutDate}
                    allowClear={false}
                    inputReadOnly
                  />
                </Form.Item>
              </ConfigProvider>

              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                <Checkbox checked={isWithoutDate} onChange={(e) => setIsWithoutDate(e.target.checked)}>
                  Без даты
                </Checkbox>
              </Form.Item>

              <Form.Item<INewTask> name='isImportant' valuePropName='checked'>
                <Checkbox>Важное</Checkbox>
              </Form.Item>
            </Form>
          </div>
          <div className={style.footer}>
            <Button
              key={1}
              text={!task ? 'Создать' : 'Редактировать'}
              size='min'
              type='primary'
              onClick={() => form.submit()}
            />
          </div>
        </div>
      )}
    </>
  )
})
