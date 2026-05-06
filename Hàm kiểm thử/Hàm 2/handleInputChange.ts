export interface BranchForTest {
  branch_id: string
  manager_id: string | null
}

export interface ManagerBranchForTest {
  branch_id: string
}

export interface ManagerForTest {
  user_id: string
  branch?: ManagerBranchForTest | null
}

export interface StaffFormDataForTest {
  [key: string]: string | number | null | undefined
  salary: number
  end_date: string | null
  user_id: string | null
  reports_to_user_id: string | null
  branch_id: string | null
  full_name?: string
}

export interface ChangeEventLikeForTest {
  target: {
    name: string
    value: string
    type?: string
  }
}

export interface HandleInputChangeDepsForTest {
  branches: BranchForTest[]
  managers: ManagerForTest[]
  setFormData: (
    updater: (prev: StaffFormDataForTest) => StaffFormDataForTest
  ) => void
}

export const handleInputChange = (
  e: ChangeEventLikeForTest,
  { branches, managers, setFormData }: HandleInputChangeDepsForTest
) => {
  const { name, value, type } = e.target

  if (name === 'salary') {
    const numericValue = value.replace(/[^0-9]/g, '')
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue ? parseInt(numericValue, 10) : 0,
    }))
  } else if (name === 'end_date' && value === '') {
    setFormData((prev) => ({
      ...prev,
      [name]: null,
    }))
  } else if (name === 'user_id') {
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }))
  } else if (name === 'reports_to_user_id') {
    if (value === '') {
      setFormData((prev) => ({
        ...prev,
        reports_to_user_id: null,
        branch_id: null,
      }))
    } else {
      const manager = managers.find((m) => m.user_id === value)
      const managerBranch = branches.find((b) => b.manager_id === value)

      if (manager && manager.branch) {
        setFormData((prev) => ({
          ...prev,
          reports_to_user_id: value,
          branch_id: manager.branch?.branch_id,
        }))
      } else if (managerBranch) {
        setFormData((prev) => ({
          ...prev,
          reports_to_user_id: value,
          branch_id: managerBranch.branch_id,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          reports_to_user_id: value,
          branch_id: null,
        }))
      }
    }
  } else {
    void type
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
}

export const createDefaultStaffFormData = (): StaffFormDataForTest => ({
  salary: 0,
  end_date: null,
  user_id: null,
  reports_to_user_id: null,
  branch_id: null,
  full_name: '',
})
