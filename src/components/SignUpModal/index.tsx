/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-irregular-whitespace */
import { useState, ChangeEvent, FormEvent, useRef, MouseEvent, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useRedux'
import { signup } from 'actions/user'
import { closeSignUpModal, openLoginModal } from 'reducers/modal'
import Portal from 'Portal'
import styles from './signupmodal.module.scss'
import { IoMdClose } from 'react-icons/io'

const SignUpModal = () => {
  const { signupError, signupDone, signupLoading } = useAppSelector((state) => state.user)

  const modalRef = useRef(null)
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [emailValueLengthError, setEmailValueLengthError] = useState(false)
  const [nicknameValueLengthError, setNicknameValueLengthError] = useState(false)
  const [passwordValueLengthError, setPasswordValueLengthError] = useState(false)
  const [checkBlank, setCheckBlank] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [message, setMessage] = useState(false)

  const validation =
    passwordError ||
    emailError ||
    emailValueLengthError ||
    nicknameValueLengthError ||
    checkBlank ||
    !nickname ||
    !email ||
    !password ||
    !passwordCheck

  useEffect(() => {
    if (signupLoading) {
      setEmail('')
      setNickname('')
      setPassword('')
      setPasswordCheck('')
    }
  }, [dispatch, signupLoading])

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setMessage(false)
    const regExp = /[^a-zA-Z0-9]/gi
    regExp.test(e.target.value) ? setEmailError(true) : setEmailError(false)
    e.target.value.length < 6 || e.target.value.length > 15
      ? setEmailValueLengthError(true)
      : setEmailValueLengthError(false)
  }

  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
    const regExp = /[ ???]/gi
    regExp.test(e.target.value) ? setCheckBlank(true) : setCheckBlank(false)
    e.target.value.length < 3 || e.target.value.length > 10
      ? setNicknameValueLengthError(true)
      : setNicknameValueLengthError(false)
  }

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordError(e.target.value !== passwordCheck)
    e.target.value.length > 15
      ? setPasswordValueLengthError(true)
      : setPasswordValueLengthError(false)
  }

  const onChangePasswordCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value)
    setPasswordError(e.target.value !== password)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== passwordCheck) {
      setPasswordError(true)
    } else if (password === passwordCheck) {
      setPasswordError(false)
    }
    setErrorMessage(true)
    setMessage(true)
    dispatch(signup({ email, password, nickname }))
  }

  const handleOpenLoginModal = () => {
    dispatch(closeSignUpModal())
    dispatch(openLoginModal())
  }

  const handleCloseModal = () => {
    dispatch(closeSignUpModal())
  }

  const onClickBackground = (e: MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      dispatch(closeSignUpModal())
    }
  }

  return (
    <Portal>
      <div className={styles.modalBackground} ref={modalRef} onClick={onClickBackground}>
        <div className={styles.modalWrapper}>
          <h2>SNACKPEDIA</h2>
          <div className={styles.signUpTitle}>????????????</div>
          <form onSubmit={onSubmit}>
            <label htmlFor='email'>?????????</label>
            <input
              id='email'
              placeholder='?????????'
              value={email}
              onChange={onChangeEmail}
              required
              maxLength={15}
              minLength={6}
            />
            {emailError && <div>??????,????????? ???????????????.</div>}
            {emailValueLengthError && <div>6?????? ?????? 15?????? ????????? ??????????????????.</div>}
            <label htmlFor='nickname'>?????????</label>
            <input
              id='nickname'
              value={nickname}
              placeholder='?????????'
              onChange={onChangeNickname}
              required
              maxLength={15}
            />
            {nicknameValueLengthError && <div>3?????? ?????? 10?????? ????????? ??????????????????.</div>}
            {checkBlank && <div>??????????????? ?????? ??????????????????.</div>}
            <label htmlFor='password'>????????????</label>
            <input
              id='password'
              value={password}
              placeholder='????????????'
              onChange={onChangePassword}
              minLength={6}
              maxLength={15}
              required
              type='password'
            />
            {passwordValueLengthError && <div>15?????? ????????? ??????????????????.</div>}
            <label htmlFor='passwordcheck'>???????????? ??????</label>
            <input
              id='passwordcheck'
              value={passwordCheck}
              placeholder='???????????? ??????'
              onChange={onChangePasswordCheck}
              minLength={6}
              maxLength={15}
              type='password'
              required
            />
            {passwordError && <div>??????????????? ???????????? ????????????</div>}
            {message && errorMessage && signupError && <div>{signupError}</div>}

            <button type='submit' disabled={validation} className={styles.signUpButton}>
              ??????????????????
            </button>
          </form>
          {message && signupDone && (
            <div className={styles.signUpDoneMessage}>
              ???????????????????????????.
              <button type='button' onClick={handleOpenLoginModal} className={styles.loginButton}>
                ??????????????? ??????
              </button>
            </div>
          )}
          <button type='button' onClick={handleCloseModal} className={styles.closeButton}>
            <IoMdClose size={20} />
          </button>
        </div>
      </div>
    </Portal>
  )
}

export default SignUpModal
