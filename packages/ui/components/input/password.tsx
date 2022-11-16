import { ForwardRefFC } from '../utils/ForwardRefFC'
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useScale, withScale } from '../use-scale'
import Input from './input'
import { defaultProps, Props } from './input-props'
import PasswordIcon from './password-icon'

interface PasswordProps extends Props {
  hideToggle?: boolean
}

const passwordDefaultProps = {
  ...defaultProps,
  hideToggle: false,
}

type NativeAttrs = Omit<React.InputHTMLAttributes<any>, keyof PasswordProps>
export type InputPasswordProps = PasswordProps & NativeAttrs

const InputPasswordComponent = React.forwardRef(
  (
    {
      hideToggle,
      children,
      ...props
    }: React.PropsWithChildren<InputPasswordProps> & typeof defaultProps,
    ref: React.Ref<HTMLInputElement | null>,
  ) => {
    const { getAllScaleProps } = useScale()
    const inputRef = useRef<HTMLInputElement>(null)
    const [visible, setVisible] = useState<boolean>(false)
    useImperativeHandle(ref, () => inputRef.current)

    const iconClickHandler = () => {
      setVisible(v => !v)
      /* istanbul ignore next */
      if (inputRef && inputRef.current) {
        inputRef.current.focus()
      }
    }

    const inputProps = useMemo(
      () => ({
        ...props,
        ref: inputRef,
        iconClickable: true,
        onIconClick: iconClickHandler,
        htmlType: visible ? 'text' : 'password',
      }),
      [props, iconClickHandler, visible, inputRef],
    )
    const icon = useMemo(() => {
      if (hideToggle) return null
      return <PasswordIcon visible={visible} />
    }, [hideToggle, visible])

    return (
      <Input iconRight={icon} {...getAllScaleProps()} {...inputProps}>
        {children}
      </Input>
    )
  },
) as ForwardRefFC<HTMLInputElement, React.PropsWithChildren<InputPasswordProps>>

InputPasswordComponent.defaultProps = passwordDefaultProps
InputPasswordComponent.displayName = 'GeistInputPassword'
const InputPassword = withScale(InputPasswordComponent)
export default InputPassword
