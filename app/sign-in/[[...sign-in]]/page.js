import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#F5F0E8',
    }}>
      <SignIn />
    </main>
  )
}
