import {
  createDefaultStaffFormData,
  handleInputChange,
  type BranchForTest,
  type ManagerForTest,
  type StaffFormDataForTest,
} from './staff-handle-input-change'

interface ExecuteHandleInputChangeArgs {
  name: string
  value: string
  branches?: BranchForTest[]
  managers?: ManagerForTest[]
  prevOverrides?: Partial<StaffFormDataForTest>
  type?: string
}

function executeHandleInputChange({
  name,
  value,
  branches = [],
  managers = [],
  prevOverrides = {},
  type = 'text',
}: ExecuteHandleInputChangeArgs) {
  const previousState = {
    ...createDefaultStaffFormData(),
    ...prevOverrides,
  }

  let nextState: StaffFormDataForTest | null = null

  const setFormData = jest.fn(
    (updater: (prev: StaffFormDataForTest) => StaffFormDataForTest) => {
      nextState = updater(previousState)
    }
  )

  handleInputChange(
    {
      target: {
        name,
        value,
        type,
      },
    },
    {
      branches,
      managers,
      setFormData,
    }
  )

  return {
    nextState,
    setFormData,
  }
}

describe('handleInputChange - lan 3 - bo ca kiem thu C3', () => {
  test.each([
    {
      testcase: 'B1',
      title: 'B1 | salary co ky tu chu thi chi lay phan so',
      input: {
        name: 'salary',
        value: '12a3',
      },
      expected: {
        salary: 123,
      },
    },
    {
      testcase: 'B2',
      title: 'B2 | end_date rong thi cap nhat null',
      input: {
        name: 'end_date',
        value: '',
      },
      expected: {
        end_date: null,
      },
    },
    {
      testcase: 'B3',
      title: 'B3 | user_id rong thi cap nhat null',
      input: {
        name: 'user_id',
        value: '',
      },
      expected: {
        user_id: null,
      },
    },
    {
      testcase: 'B4',
      title: 'B4 | reports_to_user_id rong thi xoa nguoi quan ly va chi nhanh',
      input: {
        name: 'reports_to_user_id',
        value: '',
      },
      expected: {
        reports_to_user_id: null,
        branch_id: null,
      },
    },
    {
      testcase: 'B5',
      title: 'B5 | nguoi quan ly co branch truc tiep',
      input: {
        name: 'reports_to_user_id',
        value: 'M01',
        managers: [
          {
            user_id: 'M01',
            branch: {
              branch_id: 'B01',
            },
          },
        ],
      },
      expected: {
        reports_to_user_id: 'M01',
        branch_id: 'B01',
      },
    },
    {
      testcase: 'B6',
      title: 'B6 | nguoi quan ly khong co branch truc tiep nhung co branch phu trach',
      input: {
        name: 'reports_to_user_id',
        value: 'M02',
        managers: [
          {
            user_id: 'M02',
            branch: null,
          },
        ],
        branches: [
          {
            manager_id: 'M02',
            branch_id: 'B02',
          },
        ],
      },
      expected: {
        reports_to_user_id: 'M02',
        branch_id: 'B02',
      },
    },
    {
      testcase: 'B7',
      title: 'B7 | nguoi quan ly khong co branch phu hop',
      input: {
        name: 'reports_to_user_id',
        value: 'M03',
        managers: [
          {
            user_id: 'M03',
            branch: null,
          },
        ],
      },
      expected: {
        reports_to_user_id: 'M03',
        branch_id: null,
      },
    },
    {
      testcase: 'B8',
      title: 'B8 | truong thong thuong thi cap nhat theo value',
      input: {
        name: 'full_name',
        value: 'Nguyen Van A',
      },
      expected: {
        full_name: 'Nguyen Van A',
      },
    },
    {
      testcase: 'B9',
      title: 'B9 | salary rong thi cap nhat salary = 0',
      input: {
        name: 'salary',
        value: '',
      },
      expected: {
        salary: 0,
      },
    },
    {
      testcase: 'B10',
      title: 'B10 | user_id co gia tri thi cap nhat dung gia tri',
      input: {
        name: 'user_id',
        value: 'U01',
      },
      expected: {
        user_id: 'U01',
      },
    },
    {
      testcase: 'B11',
      title: 'B11 | end_date co gia tri thi di theo nhanh cap nhat thong thuong',
      input: {
        name: 'end_date',
        value: '2026-05-07',
      },
      expected: {
        end_date: '2026-05-07',
      },
    },
    {
      testcase: 'B12',
      title: 'B12 | reports_to_user_id khong tim thay manager va branch',
      input: {
        name: 'reports_to_user_id',
        value: 'M04',
        managers: [],
        branches: [],
      },
      expected: {
        reports_to_user_id: 'M04',
        branch_id: null,
      },
    },
  ])('$testcase - $title', ({ input, expected }) => {
    const { nextState, setFormData } = executeHandleInputChange(input)

    expect(setFormData).toHaveBeenCalledTimes(1)
    expect(nextState).toMatchObject(expected)
  })
})
