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
    previousState,
    nextState,
    setFormData,
  }
}

describe('handleInputChange - staff page', () => {
  test.each([
    {
      testcase: 'B1',
      title:
        'B1 | name = "salary"; value = "12a3" | H\u00e0m c\u1eadp nh\u1eadt salary = 123',
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
      title:
        'B2 | name = "end_date"; value = "" | H\u00e0m c\u1eadp nh\u1eadt end_date = null',
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
      title:
        'B3 | name = "user_id"; value = "" | H\u00e0m c\u1eadp nh\u1eadt user_id = null',
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
      title:
        'B4 | name = "reports_to_user_id"; value = "" | H\u00e0m c\u1eadp nh\u1eadt reports_to_user_id = null, branch_id = null',
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
      title:
        'B5 | name = "reports_to_user_id"; value = "M01"; manager.user_id = "M01"; manager.branch.branch_id = "B01" | H\u00e0m c\u1eadp nh\u1eadt reports_to_user_id = M01, branch_id = B01',
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
      title:
        'B6 | name = "reports_to_user_id"; value = "M02"; manager.user_id = "M02"; branch.manager_id = "M02"; branch.branch_id = "B02" | H\u00e0m c\u1eadp nh\u1eadt reports_to_user_id = M02, branch_id = B02',
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
      title:
        'B7 | name = "reports_to_user_id"; value = "M03"; manager.user_id = "M03"; kh\u00f4ng c\u00f3 branch ph\u00f9 h\u1ee3p | H\u00e0m c\u1eadp nh\u1eadt reports_to_user_id = M03, branch_id = null',
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
      title:
        'B8 | name = "full_name"; value = "Nguy\u1ec5n V\u0103n A" | H\u00e0m c\u1eadp nh\u1eadt full_name = Nguy\u1ec5n V\u0103n A',
      input: {
        name: 'full_name',
        value: 'Nguy\u1ec5n V\u0103n A',
      },
      expected: {
        full_name: 'Nguy\u1ec5n V\u0103n A',
      },
    },
    {
      testcase: 'B9',
      title:
        'B9 | name = "salary"; value = "" | H\u00e0m c\u1eadp nh\u1eadt salary = 0',
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
      title:
        'B10 | name = "user_id"; value = "U01" | H\u00e0m c\u1eadp nh\u1eadt user_id = U01',
      input: {
        name: 'user_id',
        value: 'U01',
      },
      expected: {
        user_id: 'U01',
      },
    },
  ])('$title', ({ input, expected }) => {
    const { nextState, setFormData } = executeHandleInputChange(input)

    expect(setFormData).toHaveBeenCalledTimes(1)
    expect(nextState).toMatchObject(expected)
  })
})
