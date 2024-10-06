import React, { ReactNode } from 'react'
import style from './styles.module.scss'

export interface IColumn<T> {
  key: string
  title: string
  name: keyof T
  width?: string
  cellRender?: (value: any, row: T) => ReactNode
}

interface IProps<T> {
  columns: IColumn<T>[]
  rows: T[]
  rowHeight?: number
  onRowClick?: (row: T) => void
  showHead?: boolean
  cellClassName?: string
  rowClassName?: string
}

export const List = <T extends { id: string }>(props: IProps<T>) => {
  const { showHead = true } = props
  return (
    <table className={style.list}>
      {showHead && (
        <thead>
          <tr className={style.header}>
            {props.columns.map((column) => (
              <th
                className={style.cell}
                style={{
                  width: column.width ? `${column.width}` : 'auto',
                  minWidth: column.width ? `${column.width}` : 'auto',
                }}
                key={column.key}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {props.rows.map((row) => (
          <tr
            className={`${style.row} ${props.onRowClick ? style.pointer : ''}  ${props.rowClassName}`}
            key={row.id}
            onClick={() => props.onRowClick?.(row)}
          >
            {props.columns.map((column) => (
              <td
                className={`${style.cell} ${props.cellClassName}`}
                key={`${column.key}_${row.id}`}
                height={`${props.rowHeight || 30}px`}
                style={{
                  width: column.width ? `${column.width}` : 'auto',
                  minWidth: column.width ? `${column.width}` : 'auto',
                }}
              >
                {column.cellRender?.(row[column.name], row) || (row[column.name] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
