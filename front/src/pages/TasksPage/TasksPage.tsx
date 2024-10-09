import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Checkbox, Form, Modal, Input, DatePicker } from 'antd'
import { INewTask, ITask } from './types'
import { getDate, getDateUTC, getDayName } from '../../utils/utils'
import { Button } from '../../components/Button/Button'
import dayjs from 'dayjs'

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  const { tasksStore, userStore } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWithoutDate, setIsWithoutDate] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!userStore.user?.id) return
    tasksStore.fetchTasks()
  }, [userStore.user?.id]) // eslint-disable-line

  const onChange = async (task: ITask, isDone: boolean) => {
    await tasksStore.completeTasks(task.id, isDone)
    const tasks = [...tasksStore.tasks]
    const newTask = tasks.find((i) => i.id === task.id)
    if (newTask) {
      newTask.isDone = isDone
    }
    tasksStore.setTasks(tasks)
  }

  const onSubmit = async () => {
    const newTask: INewTask = form.getFieldsValue()
    newTask.date = isWithoutDate || !newTask.date ? undefined : getDateUTC(newTask.date)
    const createdTask = await tasksStore.createTask(newTask)
    if (createdTask) {
      const tasks = [createdTask, ...tasksStore.tasks]
      tasksStore.setTasks(tasks)
      form.resetFields()
      setIsModalOpen(false)
    }
  }

  const removeTask = async (id: string) => {
    const isSucces = await tasksStore.removeTask(id)
    if (isSucces) {
      const tasks = tasksStore.tasks.filter((i) => i.id !== id)
      tasksStore.setTasks(tasks)
    }
  }

  const orderDown = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, -1)
    isSuccess && tasksStore.fetchTasks()
  }
  const orderUp = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, 1)
    isSuccess && tasksStore.fetchTasks()
  }
  const toNextDay = async (id: string) => {
    const isSuccess = await tasksStore.sendToNextDay(id)
    isSuccess && tasksStore.fetchTasks()
  }

  return (
    <div className={style.mainPage}>
      <div className={style.menu}>
        <Button text='Создать' size='min' onClick={() => setIsModalOpen(true)} />
      </div>
      {tasksStore.groupedTasks.map((i) => (
        <div className={style.day} key={i[0].date}>
          <div className={style.date}>
            {getDate(i[0].date)} ({getDayName(i[0].date)})
          </div>
          <div className={style.taskList}>
            {i
              .sort((a, b) => a.order - b.order)
              .map((task, idx, arr) => (
                <div className={style.task} key={task.id}>
                  <Checkbox onChange={(e) => onChange(task, e.target.checked)} checked={task.isDone} />
                  <div className={style.title}>{task.order + '. ' + task.title}</div>
                  <Button text='x' size='square' onClick={() => removeTask(task.id)} />
                  <Button text='A' size='square' disabled={!idx} onClick={() => orderDown(task.id)} />
                  <Button text='V' size='square' disabled={idx === arr.length - 1} onClick={() => orderUp(task.id)} />
                  <Button text='I' size='square' onClick={() => toNextDay(task.id)} />
                </div>
              ))}
          </div>
        </div>
      ))}
      <Modal
        title='Новая задача'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key={1} text='Создать' size='min' onClick={() => form.submit()} />]}
      >
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          form={form}
          onFinish={onSubmit}
        >
          <Form.Item<INewTask> name='title' rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input placeholder='Описание задачи' />
          </Form.Item>

          <Form.Item<INewTask> name='date' initialValue={dayjs()}>
            <DatePicker placeholder='Дата' format={'DD.MM.YYYY'} minDate={dayjs()} disabled={isWithoutDate} />
          </Form.Item>

          <Form.Item>
            <Checkbox checked={isWithoutDate} onChange={(e) => setIsWithoutDate(e.target.checked)}>
              Без даты
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})
