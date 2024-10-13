import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../../../..'
import { Checkbox, Form, DatePicker, ConfigProvider, FormInstance } from 'antd'
import { EMode, INewGoal } from '../../types'
import { getDateUTC } from '../../../../utils/utils'
import { Button } from '../../../../components/Button/Button'
import dayjs from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import ru_RU from 'antd/lib/locale/ru_RU'

dayjs.locale('ru')

interface IProps {
  goalId: string | undefined
  mode: EMode
  form: FormInstance<INewGoal>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

export const Modal: React.FC<IProps> = observer((props) => {
  const { goalId, mode, form, isModalOpen, setIsModalOpen } = props

  const { goalsStore } = useStore()

  const onSubmit = async () => {
    const newGoal: INewGoal = form.getFieldsValue()

    newGoal.date = getDateUTC(newGoal.date)

    let isSuccess
    if (mode === EMode.Create) {
      isSuccess = await goalsStore.createGoal(newGoal)
    }
    if (mode === EMode.Edit && goalId) {
      isSuccess = await goalsStore.updateGoal(goalId, newGoal)
    }

    if (isSuccess) {
      goalsStore.fetchGoals()
      form.resetFields()
      setIsModalOpen(false)
      goalsStore.setExpanded(null)
    }
  }

  return (
    <>
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.header}>
            {mode === EMode.Create ? 'Новая цель' : 'Редактирование'}
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
                <TextArea autoSize={{ minRows: 3, maxRows: 3 }} placeholder='Описание задачи' />
              </Form.Item>

              <ConfigProvider locale={ru_RU}>
                <Form.Item<INewGoal>
                  name='date'
                  initialValue={dayjs()}
                  style={{ display: 'inline-block', width: '30%' }}
                >
                  <DatePicker
                    placeholder='Дата'
                    format={'DD.MM.YYYY'}
                    minDate={dayjs()}
                    allowClear={false}
                    inputReadOnly
                  />
                </Form.Item>
              </ConfigProvider>
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
    </>
  )
})
