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

describe('handleInputChange - lan 1 - bo ca kiem thu C1', () => {
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
  ])('$testcase - $title', ({ input, expected }) => {
    const { nextState, setFormData } = executeHandleInputChange(input)

    expect(setFormData).toHaveBeenCalledTimes(1)
    expect(nextState).toMatchObject(expected)
  })
})
