import React, { FormEvent } from 'react'
import { useSaleorAuthContext } from '@saleor/auth-sdk/react'
import { useUser } from '@/utils/hooks/useUser'

const User = ({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) => {
  const name = firstName.length > 0 && lastName.length > 0 ? `${firstName} ${lastName}` : email
  return (
    <div>
      <span>Hello {name} 👋</span>
    </div>
  )
}

type FormValues = {
  password: string
  email: string
}

const defaultValues: FormValues = {
  password: '',
  email: '',
}

export default function LoginPage() {
  const [formValues, setFormValues] = React.useState<FormValues>(defaultValues)
  const [errors, setErrors] = React.useState<string[]>([])

  const { signIn, signOut, isAuthenticating } = useSaleorAuthContext()
  const { user: currentUser, loading: currentUserFetching } = useUser({
    pause: isAuthenticating,
  })

  const isLoading = isAuthenticating || currentUserFetching

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await signIn(formValues)
    console.log('result', result)
    if (result.data.tokenCreate.errors) {
      setErrors(result.data.tokenCreate.errors.map((e) => e.message))
      setFormValues(defaultValues)
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))

    if (errors.length > 0) {
      setErrors([])
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <section className="container mx-auto flex flex-1 flex-col items-center justify-center">
      {currentUser ? (
        <>
          <User firstName={currentUser.firstName} lastName={currentUser.lastName} email={currentUser.email} />
          <button className="button" onClick={() => signOut()}>
            Log Out
          </button>
        </>
      ) : (
        <div>
          <form onSubmit={submitHandler}>
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={changeHandler} />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={changeHandler}
            />
            <button className="button bg-red-500" type="submit">
              Log In
            </button>
          </form>
          <div>
            {errors.map((error) => (
              <p className="error" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
