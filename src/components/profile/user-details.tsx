

type UserDetailsProps = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
}

export function UserDetails({user}: {user: UserDetailsProps}) {
  return (
    <div className="space-y-3 max-w-sm">
      <div className="">
        <h2 className="text-xl">{user.firstName} {user.lastName}</h2>
        <p className="text-purple-600 text-sm lowercase">#{user.role}</p>
      </div>

      <div className="flex justify-between">
        <span className="">Email:</span>
        <span className="">{user.email}</span>
      </div>
      <div className="flex justify-between">
        <span className="">Phone Number:</span>
        <span className="">{user.phoneNumber}</span>
      </div>
    </div>

  )
}