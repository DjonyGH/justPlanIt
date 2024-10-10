import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Checkbox, Form, DatePicker, ConfigProvider, Tooltip } from 'antd'
import { EMode, INewTask, ITask } from './types'
import { getDate, getDateUTC, getDayName, isPastDate, ucFirst } from '../../utils/utils'
import { Button } from '../../components/Button/Button'
import dayjs from 'dayjs'
import {
  BarsOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FastForwardOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import ru_RU from 'antd/lib/locale/ru_RU'

dayjs.locale('ru')

enum ETab {
  Current,
  Future,
  WithoutDate,
}

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  const { tasksStore, userStore } = useStore()
  const [tab, setTab] = useState<ETab>(ETab.Current)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isWithoutDate, setIsWithoutDate] = useState(false)
  const [mode, setMode] = useState<EMode>(EMode.Create)
  const [idTask, setIdTask] = useState<string | undefined>()
  const [form] = Form.useForm()

  useEffect(() => {
    if (!userStore.user?.id) return
    tasksStore.fetchTasks()
  }, [userStore.user?.id]) // eslint-disable-line

  const onCreate = () => {
    setMode(EMode.Create)
    setIsModalOpen(true)
    form.resetFields()
    setIdTask(undefined)
  }

  const onEdit = (task: ITask) => {
    setMode(EMode.Edit)
    setIsModalOpen(true)
    form.setFieldValue('title', task.title)
    form.setFieldValue('date', dayjs(task.date))
    setIsWithoutDate(!task.date)
    setIdTask(task.id)
  }

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
    console.log('newTask.date', newTask.date)
    let isSuccess
    if (mode === EMode.Create) {
      isSuccess = await tasksStore.createTask(newTask)
    }
    if (mode === EMode.Edit && idTask) {
      isSuccess = await tasksStore.updateTask(idTask, newTask)
    }

    if (isSuccess) {
      tasksStore.fetchTasks()
      // const tasks = [createdTask, ...tasksStore.tasks]
      // tasksStore.setTasks(tasks)
      form.resetFields()
      setIsModalOpen(false)
    }
  }

  const removeTask = async (id: string) => {
    const isSucces = await tasksStore.removeTask(id)
    if (isSucces) {
      const tasks = tasksStore.tasks.filter((i) => i.id !== id)
      tasksStore.setTasks(tasks)
      setIsTooltipOpen(false)
    }
  }

  const orderDown = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, -1)
    isSuccess && tasksStore.fetchTasks()
    setIsTooltipOpen(false)
  }
  const orderUp = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, 1)
    isSuccess && tasksStore.fetchTasks()
    setIsTooltipOpen(false)
  }
  const toNextDay = async (id: string) => {
    const isSuccess = await tasksStore.sendToNextDay(id)
    isSuccess && tasksStore.fetchTasks()
    setIsTooltipOpen(false)
  }

  const groupedTasks: Record<ETab.Current | ETab.Future, ITask[][]> = {
    [ETab.Current]: tasksStore.currentTasks,
    [ETab.Future]: tasksStore.futureTasks,
  }

  return (
    <div className={style.mainPage}>
      <div className={style.menu}>
        <div className={style.leftSide}>
          <Button
            text='Текущие'
            size='min'
            type={tab === ETab.Current ? 'primary' : 'default'}
            onClick={() => setTab(ETab.Current)}
          />
          <Button
            text='Будущие'
            size='min'
            type={tab === ETab.Future ? 'primary' : 'default'}
            onClick={() => setTab(ETab.Future)}
          />
          <Button
            text='Без даты'
            size='min'
            type={tab === ETab.WithoutDate ? 'primary' : 'default'}
            onClick={() => setTab(ETab.WithoutDate)}
          />
        </div>
        <Button text={() => <PlusOutlined />} type='primary' size='square' onClick={onCreate} />
      </div>
      {tab !== ETab.WithoutDate &&
        groupedTasks[tab].map((i) => (
          <div className={style.day} key={i[0].date}>
            <div className={style.date}>
              {getDate(i[0].date)} {ucFirst(getDayName(i[0].date))}
            </div>
            <div className={style.taskList}>
              {i
                .sort((a, b) => a.order - b.order)
                .map((task, idx, arr) => (
                  <div className={style.task} key={task.id}>
                    <div className={style.checkbox} onClick={(e) => onChange(task, !task.isDone)}>
                      {!task.isDone && !isPastDate(task.date) && <div className={style.empty} />}
                      {!task.isDone && isPastDate(task.date) && (
                        <CloseOutlined style={{ color: 'var(--red)', fontSize: '18px' }} />
                      )}
                      {!!task.isDone && <CheckOutlined style={{ color: 'var(--green)', fontSize: '18px' }} />}
                    </div>

                    <div className={style.title}>{task.title}</div>
                    {!isPastDate(task.date) && (
                      <div className={style.edit}>
                        <Tooltip
                          placement='bottomLeft'
                          fresh
                          mouseLeaveDelay={0}
                          open={isTooltipOpen}
                          title={
                            <div className={style.controls}>
                              <CaretUpOutlined
                                style={{ color: 'var(--gray)', fontSize: '20px' }}
                                onClick={() => orderDown(task.id)}
                              />
                              <CaretDownOutlined
                                style={{ color: 'var(--gray)', fontSize: '20px' }}
                                onClick={() => orderUp(task.id)}
                              />
                              <FastForwardOutlined
                                style={{ color: 'var(--gray)', fontSize: '20px' }}
                                onClick={() => toNextDay(task.id)}
                              />
                              <EditOutlined
                                style={{ color: 'var(--gray)', fontSize: '20px' }}
                                onClick={() => onEdit(task)}
                              />
                              <DeleteOutlined
                                style={{ color: 'var(--red)', fontSize: '20px' }}
                                onClick={() => removeTask(task.id)}
                              />
                            </div>
                          }
                        >
                          <BarsOutlined style={{ fontSize: '16px' }} onClick={() => setIsTooltipOpen(true)} />
                        </Tooltip>
                      </div>
                    )}
                    {/* <Button text='x' size='square' onClick={() => removeTask(task.id)} />
                  <Button text='A' size='square' disabled={!idx} onClick={() => orderDown(task.id)} />
                  <Button text='V' size='square' disabled={idx === arr.length - 1} onClick={() => orderUp(task.id)} />
                  <Button text='I' size='square' onClick={() => toNextDay(task.id)} />
                  <Button text='E' size='square' onClick={() => onEdit(task)} /> */}
                  </div>
                ))}
            </div>
          </div>
        ))}
      {tab === ETab.WithoutDate && (
        <div className={style.taskList}>
          {tasksStore.tasksWithoutDate
            .sort((a, b) => a.order - b.order)
            .map((task, idx, arr) => (
              <div className={style.task} key={task.id}>
                <div className={style.checkbox} onClick={(e) => onChange(task, !task.isDone)}>
                  {!task.isDone && !isPastDate(task.date) && <div className={style.empty} />}
                  {!task.isDone && isPastDate(task.date) && (
                    <CloseOutlined style={{ color: 'var(--red)', fontSize: '18px' }} />
                  )}
                  {!!task.isDone && <CheckOutlined style={{ color: 'var(--green)', fontSize: '18px' }} />}
                </div>

                <div className={style.title} onClick={(e) => console.log('!!!', e)}>
                  {task.title}
                </div>
                {!isPastDate(task.date) && (
                  <div className={style.edit}>
                    <EditOutlined style={{ fontSize: '16px' }} />
                  </div>
                )}
                {/* <Button text='x' size='square' onClick={() => removeTask(task.id)} />
                  <Button text='A' size='square' disabled={!idx} onClick={() => orderDown(task.id)} />
                  <Button text='V' size='square' disabled={idx === arr.length - 1} onClick={() => orderUp(task.id)} />
                  <Button text='I' size='square' onClick={() => toNextDay(task.id)} />
                  <Button text='E' size='square' onClick={() => onEdit(task)} /> */}
              </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.header}>
            {mode === EMode.Create ? 'Новая задача' : 'Редактирование'}
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
                <Form.Item<INewTask> name='date' initialValue={dayjs()}>
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

              <Form.Item>
                <Checkbox checked={isWithoutDate} onChange={(e) => setIsWithoutDate(e.target.checked)}>
                  Без даты
                </Checkbox>
              </Form.Item>
            </Form>
          </div>
          <div className={style.footer}>
            <Button
              key={1}
              text={mode === EMode.Create ? 'Создать' : 'Редактировать'}
              size='min'
              type='primary'
              onClick={() => form.submit()}
            />
          </div>
        </div>
      )}

      <div className={style.editModal}></div>
    </div>
  )
})
