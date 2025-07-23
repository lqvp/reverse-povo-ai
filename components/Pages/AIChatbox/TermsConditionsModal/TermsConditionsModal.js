import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material'
import './TermsAndConditionsDialog.css'
import PropTypes from 'prop-types'
import { axiosGet } from '../../../../utils/axios'
import common from '@kelchy/common'
import { getTenantName } from '../../../../helpers/tenantHelper'
import { TENANTS } from '../../../../common/constants'

const tenant = getTenantName()

function TermsAndConditionsModal({ open, setOpen, onNext }) {
  const [agreed, setAgreed] = useState(false)

  const handleCheckboxChange = (event) => {
    setAgreed(event.target.checked)
  }

  const handleClose = (_, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      setOpen(false)
    }
  }

  const saveAgreedStatus = async () => {
    localStorage.setItem('aiPovoTermsAgreed', 'true')

    const { data: chatBotResponse } = await common.awaitWrap(
      axiosGet('/user/ai-chatbox/save-accept-terms', {})
    )
    if (chatBotResponse?.data.success) {
      localStorage.setItem('aiPovoTermsAgreed', 'true')
      onNext()
    }
  }

  useEffect(() => {
    const getTermsAgreedStatus = localStorage.getItem('aiPovoTermsAgreed')
    if (getTermsAgreedStatus !== 'true' && tenant === TENANTS.POVO) {
      setOpen(true)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const checkTermsAgreed = async () => {
      const termsAgreed = localStorage.getItem('aiPovoTermsAgreed') === 'true'
      if (termsAgreed) {
        onNext()
      }
    }
    checkTermsAgreed()

    // eslint-disable-next-line
  }, [])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      scroll='paper'
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          overflow: 'hidden'
        }
      }}
      className='ai-povo-terms-dialog'
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1
        }}
      >
        <Typography
          variant='h6'
          sx={{ flexGrow: 1, textAlign: 'center', marginRight: 4 }}
          className='ai-povo-terms-title'
        >
          povo AI 規約
        </Typography>
      </DialogTitle>

      {/* Terms Content */}
      <DialogContent
        dividers
        sx={{ maxHeight: '60vh' }}
        className='ai-povo-terms-content'
      >
        <Typography
          variant='body2'
          sx={{ whiteSpace: 'pre-wrap' }}
          className='ai-povo-terms-text'
        >
          <br />
          ・本サービスは、利用者の入力した情報から、それに対応する回答を自動で生成するサービスです。
          <br />
          ・本サービスは、その一部に、OpenAI,L.L.C.ならびにPerplexity
          Inc.が提供する文章生成AIサービスを利用します。利用者は、本サービスの利用にあたりの
          <a
            href='https://openai.com/ja-JP/policies/row-terms-of-use/'
            target='_blank'
            rel='noreferrer'
          >
            OpenAI,L.L.C.利用規約
          </a>
          ならびに
          <a
            href='https://www.perplexity.ai/hub/legal/terms-of-service'
            target='_blank'
            rel='noreferrer'
          >
            Perplexity Inc.利用規約
          </a>
          が適用されることを承諾し、当該利用規約を遵守するものとします。
          <br />
          ・利用者は、入力内容に関し、必要な全ての権利、ライセンス及び許諾を有することを表明し、保証します。
          <br />
          ・利用者は、生成物を利用する際に、人間の尊厳と個人の自律を尊重し、法令に従うこと及び他人の権利を侵害しないことに同意するものとし、生成物の利用者による各種SNSへの投稿又はその他の方法による開示、複製、第三者への送付及び共有に関し、当該第三者による行為を含め、一切の責任を負うものとします。
          <br />
          ・利用者は、本コンテンツが、利用者や第三者の人間としての尊厳や個人の自律を損なわないよう、法令違反、公序良俗違反、または又は当社及び第三者の権利を侵害するおそれのある画像が生成できないようあらかじめ設定されており、その結果、生成物が出力できない場合があることに同意します。なお、当社は、本コンテンツによる生成（生成できないことを含みます）につき何ら保証するものではありません。
          <br />
          ・本サービスは、OpenAI,L.L.C.ならびにPerplexity
          Inc.に定める外部事業者のAIシステムの応答速度その他の性能に依存するほか、その性質上、当該AIシステムの学習状況や利用者から取得した応対履歴によって出力内容が変化する場合があります。
          <br />
          ・利用者の入力内容に対する本サービスのアウトプットは常に正確であるとは限らず、利用者は、本サービスからのアウトプットの正確性と適切性を自ら評価する必要があります。当社は、本サービスの内容及び結果について、その完全性、正確性、安全性、目的適合性又は有用性等につき、何ら保証するものではなく、当該内容及び結果が第三者の権利を侵害しないこと等について何ら保証するものではありません。
          <br />
          ・当社は、利用者の入力した情報をAIによる機械学習のための学習用データセットとして利用することはありません。
          <br />
          ・当社はお客さまに対して事前に予告することなく、本サービスの内容を変更し、または本施策の一部または全部の実施を終了、中止又は停止することがあります。
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 3, pb: 2 }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={handleCheckboxChange}
              className='ai-povo-terms-checkbox'
              sx={{
                color: '#333',
                '&.Mui-checked': {
                  color: '#333'
                }
              }}
            />
          }
          label='povo AI 規約を確認しました'
          className='ai-povo-terms-checkbox-label'
        />
        <Button
          variant='contained'
          fullWidth
          disabled={!agreed}
          sx={{ borderRadius: '24px', fontWeight: 600 }}
          onClick={saveAgreedStatus}
          className='ai-povo-terms-next-button'
        >
          次へ
        </Button>
      </DialogActions>
    </Dialog>
  )
}

TermsAndConditionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default TermsAndConditionsModal
