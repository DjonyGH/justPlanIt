import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Checkbox, Form, Modal, Input, DatePicker } from 'antd'
import { INewTask, ITask } from './types'
import { getDate, getDayName } from '../../utils/utils'
import { Button } from '../../components/Button/Button'
import dayjs from 'dayjs'

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  const { tasksStore, userStore } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    const createdTask = await tasksStore.createTask(newTask)
    if (createdTask) {
      const tasks = [createdTask, ...tasksStore.tasks]
      tasksStore.setTasks(tasks)
      form.resetFields()
      setIsModalOpen(false)
    }
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
            {i.map((task) => (
              <div className={style.task} key={task.id}>
                <Checkbox onChange={(e) => onChange(task, e.target.checked)} checked={task.isDone} />
                <div className={style.title}>{task.title}</div>
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
            <DatePicker placeholder='Дата' format={'DD.MM.YYYY'} minDate={dayjs()} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})
