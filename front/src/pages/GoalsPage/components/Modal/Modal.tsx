import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../../../..'
import { Form, Select } from 'antd'
import { IGoal, IGoalForm, INewGoal, IOption } from '../../types'
import { Button } from '../../../../components/Button/Button'
import { CloseOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import { addZeroBefore, getCurrentMonth, getCurrentYear } from '../../../../utils/utils'

interface IProps {
  goal: IGoal | undefined
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

export const Modal: React.FC<IProps> = observer((props) => {
  const { goal, isModalOpen, setIsModalOpen } = props

  const { goalsStore } = useStore()
  const [form] = Form.useForm<IGoalForm>()

  const [daysInMonth, setDaysInMonth] = useState<number | undefined>(undefined)

  useEffect(() => {
    const currentYaer = getCurrentYear()
    const currentMonth = getCurrentMonth()
    const daysInMonth = getDaysInMonth(currentMonth, currentYaer)
    setDaysInMonth(daysInMonth)
    form.resetFields()
    if (goal) {
      form.setFieldValue('title', goal.title)
      form.setFieldValue('year', goal.date.substring(0, 4))
      form.setFieldValue('month', goal.date.substring(5, 7))
      form.setFieldValue('day', goal.date.substring(8, 10))
    }
  }, [isModalOpen, goal?.id]) // eslint-disable-line

  const onSubmit = async () => {
    const goalForm: IGoalForm = form.getFieldsValue()

    let date = `${goalForm.year}`

    if (goalForm.month) {
      date = date + `-${goalForm.month}`
    }

    if (goalForm.day) {
      date = date + `-${goalForm.day}`
    }

    const newGoal: INewGoal = {
      title: goalForm.title,
      date,
    }

    let isSuccess
    if (!goal) {
      isSuccess = await goalsStore.createGoal(newGoal)
    } else {
      isSuccess = await goalsStore.updateGoal(goal.id, newGoal)
    }

    if (isSuccess) {
      goalsStore.fetchGoals()
      form.resetFields()
      setIsModalOpen(false)
      goalsStore.setExpanded(null)
    }
  }

  const getYearOptions = (): IOption[] => {
    const currentYaer = getCurrentYear()
    return Array(10)
      .fill(0)
      .map((_, i) => ({
        value: `${i + currentYaer}`,
        label: `${i + currentYaer}`,
      }))
  }

  const getMonthOptions = (): IOption[] => {
    return [
      {
        value: '01',
        label: 'Январь',
      },
      {
        value: '02',
        label: 'Февраль',
      },
      {
        value: '03',
        label: 'Март',
      },
      {
        value: '04',
        label: 'Апрель',
      },
      {
        value: '05',
        label: 'Май',
      },
      {
        value: '06',
        label: 'Июнь',
      },
      {
        value: '07',
        label: 'Июль',
      },
      {
        value: '08',
        label: 'Август',
      },
      {
        value: '09',
        label: 'Сентябрь',
      },
      {
        value: '10',
        label: 'Октябрь',
      },
      {
        value: '11',
        label: 'Ноябрь',
      },
      {
        value: '12',
        label: 'Декабрь',
      },
    ]
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getDaysOptions = () =>
    daysInMonth
      ? Array(daysInMonth)
          .fill(1)
          .map((_, i) => ({
            value: addZeroBefore(i + 1),
            label: i + 1,
          }))
      : []

  return (
    <>
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.header}>
            {!goal ? 'Новая цель' : 'Редактирование'}
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
              <Form.Item<INewGoal> name='title' rules={[{ required: true, message: 'Обязательное поле' }]}>
                <TextArea autoSize={{ minRows: 3, maxRows: 3 }} placeholder='Описание цели' />
              </Form.Item>

              <Form.Item
                name='year'
                initialValue={getCurrentYear()}
                style={{ width: 'calc(33% - 10px)', display: 'inline-block', marginRight: '10px' }}
              >
                <Select options={getYearOptions()} suffixIcon={null} />
              </Form.Item>

              <Form.Item
                name='month'
                initialValue={`${getCurrentMonth()}`}
                style={{ width: 'calc(33% - 10px)', display: 'inline-block', marginRight: '10px' }}
              >
                <Select
                  options={getMonthOptions()}
                  onChange={(e) => {
                    if (!e) {
                      setDaysInMonth(undefined)
                      form.setFieldValue('day', undefined)
                    } else {
                      const daysInMonth = getDaysInMonth(+e, form.getFieldValue('year'))
                      setDaysInMonth(daysInMonth)
                      const selectedDay = form.getFieldValue('day')
                      if (selectedDay > daysInMonth) {
                        form.setFieldValue('day', '01')
                      }
                    }
                  }}
                  allowClear
                  suffixIcon={<CloseOutlined />}
                />
              </Form.Item>

              <Form.Item
                name='day'
                initialValue={daysInMonth && addZeroBefore(daysInMonth)}
                style={{ width: 'calc(33% - 10px)', display: 'inline-block' }}
              >
                <Select options={getDaysOptions()} disabled={!daysInMonth} allowClear suffixIcon={<CloseOutlined />} />
              </Form.Item>
            </Form>
          </div>
          <div className={style.footer}>
            <Button
              key={1}
              text={!goal ? 'Создать' : 'Редактировать'}
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
