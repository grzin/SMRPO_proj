import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { useState } from 'react'

export default function PasswordInput({ name, ...props }: React.ComponentProps<'input'>) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const passwordType = passwordVisible ? 'text' : 'password'

  return (
    <div className="flex items-center gap-2">
      <Input name={name} id={name} type={passwordType} required {...props} />
      {passwordVisible ? (
        <EyeOff
          className="text-muted-foreground cursor-pointer"
          onClick={() => setPasswordVisible(false)}
        />
      ) : (
        <Eye
          className="text-muted-foreground cursor-pointer"
          onClick={() => setPasswordVisible(true)}
        />
      )}
    </div>
  )
}
