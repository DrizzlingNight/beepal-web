<template>
  <div class="edit">
    <page-head>
      <template v-slot:left>
        <van-icon name="arrow-left" class="ft24" @click="$router.push('/my')"/>
      </template>
      <template v-slot:title>{{ $t('my.editInfo.title') }}</template>
      <template v-slot:right><span></span></template>
    </page-head>
    <div class="main-content">
      <div class="mt15">
        <van-cell is-link center @click="toggleShow">
          <template #right-icon>
            <img ref="avatar" :src="avatar" class="avatar"/>
            <van-icon name="arrow" class="van-cell__right-icon"/>
          </template>
          {{ $t('my.editInfo.head') }}
        </van-cell>
        <van-cell is-link center @click="$router.push('/editName')">
          <template #right-icon>
            <span>{{ VG__userInfo.nickname }}</span>
            <van-icon name="arrow" class="van-cell__right-icon"/>
          </template>
          {{ $t('my.editInfo.nickname') }}
        </van-cell>
        <van-cell is-link center @click="$router.push('/myInvitationCode')">
          <template #right-icon>
            <van-icon name="qr" class="ft20"/>
            <van-icon name="arrow" class="van-cell__right-icon"/>
          </template>
          {{ $t('my.editInfo.myInvitationCode') }}
        </van-cell>
        <van-cell is-link center @click="$router.push('/my/kyc')">
          <template #right-icon>
            <span
              :class="VG__userInfo.certification && VG__userInfo.certification.base_certification ? 'auth' : 'no_auth'"
              class="auth_text">{{ auth }}</span>
            <van-icon name="arrow" class="van-cell__right-icon"/>
          </template>
          {{ $t('my.kyc.title') }}
        </van-cell>
      </div>
      <!--      <div class="app__layout-content"></div>-->
      <my-upload v-model="show"
                 :width="92"
                 :height="92"
                 :headers="headers"
                 :no-rotate="false"
                 :method="uploadMethod"
                 :url="uploadUrl + `user/${VG__userInfo.id}/`"
                 :lang-type="lang[$i18n.locale]"
                 :file-name="VG__userInfo.id + '_' + new Date().getTime()"
                 :max-size="51200"
                 field="avatar"
                 img-format="png"
                 no-circle
                 @crop-success="cropSuccess"
                 @crop-upload-success="cropUploadSuccess"
                 @crop-upload-fail="cropUploadFail"></my-upload>
    </div>
  </div>
</template>

<script>
  import pageHead from '@/components/head/Normal_head'
  // import { settings } from '@/config'
  import { Cell, Icon } from 'vant'
  import { mapActions, mapGetters } from 'vuex'
  import myUpload from 'vue-image-crop-upload'
  import Storage from '@/utils/storage'
  import { getUserCertification } from '@/api'

  // const regex = /.*csrftoken=([^;.]*).*$/
  export default {
    name: 'EditInfo',
    components: {
      pageHead,
      [Cell.name]: Cell,
      [Icon.name]: Icon,
      myUpload,
    },
    data() {
      return {
        show: false,
        uploadUrl: process.env.VUE_APP_BASE_API,
        headers: {
          'Authorization': `Bearer ${Storage.getLocal('token')}`,
        },
        lang: {
          cn: 'zh',
          en: 'en',
          tw: 'zh-tw',
        },
        fileName: null,
        uploadMethod: 'PATCH'
      }
    },
    computed: {
      ...mapGetters(['VG__userInfo']),
      avatar() {
        return this.VG__userInfo.avatar || require('./avatar.png')
      },
      auth() {
        const certificate = this.VG__userInfo.certification
        if (certificate) {
          if (certificate.base_certification && certificate.high_certification) {
            return this.$t('my.kyc.text_10')
          } else if (certificate.base_certification && !certificate.high_certification) {
            return this.$t('my.kyc.text_2')
          } else if (!certificate.base_certification) {
            return this.$t('my.kyc.text_3')
          }
        } else return this.$t('my.kyc.text_3')
      },
    },
    created() {
      this.getUserCertification(this.VG__userInfo.id)
    },
    mounted() {
      this.VA__updateUserInfo()
    },
    methods: {
      ...mapActions('user', ['VA__updateUserInfo', 'VA__setUserInfo']),
      // upload(event) {
      //   const camera = document.createElement('input')
      //   camera.setAttribute('type', 'file')
      //   camera.setAttribute('capture', 'camera')
      //   camera.id = 'camera'
      //   const pageContentElement = document.querySelector('.app__layout-content')
      //   pageContentElement.appendChild(camera)
      //   // const frame = document.createElement('img')
      //   camera.addEventListener('change', event => {
      //     if (event.target && event.target.files.length > 0) {
      //       // frame.src = URL.createObjectURL(event.target.files[0])
      //       const username = this.VG__userInfo.username
      //       const file = event.target.files[0]
      //       const fileName = file.name;
      //       const suffix = fileName.substring(fileName.indexOf('.')).toLowerCase()
      //       if (suffix !== '.bmp' && suffix !== '.png' && suffix !== '.gif' && suffix !== '.jpg' && suffix !== '.jpeg') {
      //         Toast.fail({
      //           message: this.$t('upload.typeLimit')
      //         })
      //         return;
      //       } else if (file.size / (1024 * 1024) > 2) {
      //         Toast.fail({
      //           message: this.$t('upload.sizeLimit')
      //         })
      //         return;
      //       }
      //       const name = username + '_' + (new Date().getTime()) + '_' + fileName
      //       const nfile = new File([file], name, { type: file.type })
      //       const fd = new FormData()
      //       fd.append('avatar', nfile)
      //       const data = fd
      //       uploadHead(data).then(res => {
      //         const avatar = res.avatar
      //         const img = this.$refs.avatar
      //         img.src = avatar
      //         this.VA__updateUserProfile(res);
      //       })
      //     }
      //   })
      //   camera.click()
      //   pageContentElement.removeChild(camera)
      // },
      toggleShow() {
        this.show = !this.show
      },
      cropSuccess(imgDataUrl, field) {
        console.log('-------- crop success --------')
      },
      cropUploadSuccess(jsonData, field) {
        console.log('-------- upload success --------')
        // this.$myConsole.log('jsonData', jsonData)
        const avatar = jsonData.data.avatar
        const img = this.$refs.avatar
        img.src = avatar
        this.VA__updateUserInfo()
      },
      cropUploadFail(status, field) {
        console.log('-------- upload fail --------')
      },
      async getUserCertification(user) {
        const userInfo = { ...this.VG__userInfo }
        await getUserCertification(user)
          .then(async res => {
            const certification = res.data
            userInfo.certification = certification
            this.$myConsole.info('userInfo', userInfo)
            Storage.setLocal('userInfo', userInfo)
            this.VA__setUserInfo(userInfo)
          })
          .catch(err => {
            userInfo.certification = {}
            this.$myConsole.error('getUserCertification-err', err)
            this.$myConsole.info('userInfo', userInfo)
            Storage.setLocal('userInfo', userInfo)
            this.VA__setUserInfo(userInfo)
          })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }

  ::v-deep .van-cell {
    color: $Color;
    background-color: $listBgColor;
    margin-bottom: 1px;

    &:active {
      background-color: $listActiveBgColor;
    }
  }

  .app__layout-content {
    display: block;
  }

  .auth_text {
    font-size: 14px;
  }

  .auth {
    color: $gathering;
  }

  .no_auth {
    color: $errorColor;
  }

</style>
