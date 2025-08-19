export default {
  name: 'English',
  base: {
    nav_1: 'Price',
    nav_2: 'OTC',
    nav_3: 'Discover',
    nav_4: '钱包', // 增
    nav_5: 'Me',
    nav_6: 'Home',
    nav_7: 'Transaction',
    nav_8: 'Chat',
    loading: 'Loading...',
    getValidationCode: '获取验证码', // 增
    unknownErr: '发生未知错误', // 增
    noEmpty: '不得为空', // 增
    noZero: '不得為0', // 增
    noMaxThan: '不得大于', // 增
    noMinThan: '不得小于', // 增
    noNicknameUser: '[该用户尚未设置暱称]', // 增
    cancel: '取消', // 增
    goChange: '去更改', // 增
    goAdd: '去添加', // 增
    goSet: '去设置', // 增
    goBuy: '去购买', // 增
    goKyc: '去认证', // 增
    confirm: '确认', // 增
    delete: '删除', // 增
    edit: '编辑', // 增
    clickToReload: '点即刷新', // 增
    empty: '无', // 增
  },
  errorCode: {
    // 通用提示
    10001: '请求失败', // 增
    10002: '重复操作', // 增
    10003: '操作失败', // 增
    10004: '错误的操作。请检查工作顺序，以及上一步工作是否完成', // 增
    10005: '因系统维护，相关功能已关闭，请检查全局开关状态', // 增
    10006: '相关功能尚未实现', // 增
    10007: '并发错误，执行事务时先决条件已不再满足', // 增
    10008: '权限错误', // 增
    10101: '模板不存在', // 增
    // 用户
    20001: '用户不存在', // 增
    20002: '用户已注册', // 增
    20003: '用户名重复', // 增
    20004: '无效的邀请码，请检查邀请码', // 增
    20005: '不支持的类型', // 增
    20006: '安全码错误', // 增
    20007: '手机或邮箱重复', // 增
    20101: '用户没有地址', // 增
    20102: '到账失败，用户余额异常', // 增
    20103: '扣款失败，用户余额不足', // 增
    20104: '钱包不存在，请检查地址和币种配置', // 增
    20105: '创建币地址失败', // 增
    20106: '提款失败，请检查request_id', // 增
    20107: '不能向自己转账', // 增
    20201: '访问的IP不符合白名单', // 增
    20202: '认证状态错误', // 增
    // 登录注册
    20301: '用户名或密码错误', // 增
    20302: '验证码过期', // 增
    20303: '验证码错误', // 增
    20304: '邮箱验证码错误', // 增
    20305: '手机验证码错误', // 增
    20306: '邮箱验证码过期', // 增
    20307: '手机验证码过期', // 增
    // 收款方式
    20401: '收款方式使用中，不可以修改或删除', // 增
    20402: '存在同类型收款方式', // 增
    20403: '收款方式错误', // 增
    20404: '该帐户为默认帐户', // 增
    // 币种
    30001: '币种不存在，请检查code配置', // 增
    30002: '交易状态异常', // 增
    30003: '交易法币无效，请检查coin配置', // 增
    30004: '目标地址与本地地址冲突', // 增
    // 订单
    40001: '汇率无效，请检查当前汇率获取', // 增
    40002: '第三方订单号已存在', // 增
    40003: '订单状态异常', // 增
    40004: '订单缺少金额配置，请检查参数', // 增
    40005: '订单编辑失败', // 增
    40006: '订单没有付款信息，兑出/提币订单需要填写或配置付款渠道', // 增
    40007: '申请Cobo地址失败，多是网络问题，可重试', // 增
    40008: '有未完成的订单', // 增
    40009: '订单生成失败', // 增
    40010: '订单信息异常', // 增
    40011: '订单条件不满足', // 增
    40012: '法币不一致', // 增
    40013: '认证等级不满足条件', // 增
    40014: '成交数不满足条件', // 增
    40015: '违规次数超出限制', // 增
    // 广告
    50001: '广告不可编辑', // 增
    50002: '无效的广告', // 增
  },
  country: {
    china: '中国', // 增
    taiwan: '台湾', // 增
    hongKong: '香港', // 增
  },
  head: {
    nav_1: 'Add friends',
    nav_2: 'Scan',
    nav_3: 'Send points',
    nav_4: 'Receive point code',
  },
  scan: {
    title: 'Scan',
    placeholder_1: 'Find by name/ID',
    text_1: 'Scan the other party\'s QR code to add',
    text_2: 'The user was not found',
    text_3: 'Add as friend',
    text_4: 'No need to add friends, scan the QR code to send me points',
    text_5: 'Cannot add yourself as a friend',
    text_6: 'The friend has been added',
    text_7: 'No such user',
    text_8: 'Do not click repeatedly',
    text_9: 'Successfully added friends',
    text_10: 'Failed to add friend',
    text_11: 'Save the code',
    text_12: 'Qr code receiving point',
    text_13: 'Code record',
    text_14: 'Send message',
    text_15: 'QR code is not supported',
    text_16: 'QR code not found',
    deleteFriend: '删除好友', // 增
    deleteFriend_confirmText: '确定要删除好友？', // 增
  },
  buy: {
    wallet: 'My wallet',
    text_1: 'Consumption points',
    nav_1: 'Overview',
    nav_2: 'Month',
    text_2: 'Transfer In',
    text_3: 'Transfer Out',
    text_4: 'Total revenue and expenditure',
    text_5: 'QR Pay',
  },
  month: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  loading: {
    text_1: 'Loading',
    text_2: 'Loading...',
    text_3: 'Drop down to refresh...',
    text_4: 'Free to refresh...',
    end: 'No more',
    noRecord: 'No record',
  },
  coin_type: {
    TransferIn: 'Transfer In',
    TransferOut: 'Transfer Out',
    BillFreeze: 'Order Freeze',
    BillReturn: 'Order returned',
    BillFinish: 'Order completed',
    TransferOutReturn: 'Transfer Out Refund',
    PoolUp: 'Reservoir up',
    PoolDown: 'Reservoir down',
    TransactionOutCollection: 'Release Collection',
    TransactionOutCollectionReturn: 'Delivery collection return',
    TransferOutFee: 'Withdrawal fee',
    TransferOutFeeReturn: 'Withdrawal fee refund',
    CreditCoin: 'Credit currency distribution',
    CreditCoinSettle: 'Credit currency cycle settlement',
    FakeAmount: 'Virtual Account Change',
    TelegramGameBet: 'TG robot game betting',
    TelegramGameBetReturn: 'TG robot game betting return',
    TelegramGameWin: 'TG robot game profit',
    InwardDepositTransfer: 'Customer transfers to the system',
    InwardWithdrawTransfer: 'Customer draws out from the system',
  },
  home: {
    title: 'Price',
    text_1: 'Name',
    text_2: 'Latest Price',
    text_3: 'Change(24H)',
    text_4: 'No information found...',
    loading: 'Loading...',
    text_5: 'Volume',
    text_6: 'No information found...',
    service: 'Service',
    trade: '广告商', // 增
    lesson: '课程', // 增
  },
  trade: {
    title_1: 'Quick buy',
    title_2: 'Self select buy',
    tab_1: 'BUY',
    tab_2: 'SELL',
    details: 'History',
    payType: {
      payType_1: 'Bank Card',
      payType_2: 'ALIPAY',
      payType_3: 'ALIPAY(Pay On Behalf)',
      payType_4: 'ALIPAY（Manual Key Amount）',
      payType_5: 'ALIPAY（Editable Amount）',
      payType_6: 'WECHAT',
    },
    quickBuy: {
      text_1: 'Purchase Amount',
      input_1: 'Enter purchase amount',
      keyboard_1: 'Completed',
      tip_1: 'Minimum amount not lower than',
      tip_2: 'Maximum amount not exceed',
      dropdown_1: 'Please select a payment method',
      dropdown_2: 'Confirm',
      button_buy: 'Buy',
      dialog_title: 'Confirm Buy',
      dialog_1: 'Whether to Use',
      dialog_2: 'Buy',
      toast_1: 'Please enter amount',
      toast_2: 'Minimum amount not lower than',
      toast_3: 'Maximum amount not exceed',
      toast_4: 'Please select a payment method',
      toast_5: 'Failed to purchase',
    },
    quickSell: {
      text_1: 'Sell amount',
      text_2: 'Wallet Balance',
      input_1: 'At least 10 USDT',
      button_allSell: 'Maximum amount',
      keyboard_1: 'Completed',
      tip_1: 'Maximum sellable Amount',
      dropdown_1: 'Please select a payment method',
      dropdown_2: 'Confirm',
      button_sell: 'Sell',
      dialog_title: 'Confirm Sell',
      sell_dialog: 'Current 2 USDT selling price is 14.3 RMB , handling fee is 0.2 USDT',
      sell_dialog_1: 'Current',
      sell_dialog_2: 'selling price is',
      sell_dialog_fee: 'Handling fee is',
    },
    orderStatus: {
      text_1: 'Orders',
      status_1: ' Completed',
      status_2: ' Cancelled',
      status_3: ' Pending',
      status_4: ' Failed',
      label_1: 'Seller',
      label_2: 'Order Amount',
      label_3: 'Payment Receive Method',
      label_4: 'Unit Price',
      label_5: 'Quantity',
      label_6: 'Payment Reference Number',
      label_7: 'Order Number',
      label_8: 'Order Time',
      label_9: 'Fees',
    },
    pay: {
      text_1: 'Unpaid',
      text_2: 'Buy',
      button_1: 'Cancel Transaction',
      button_2: 'Pay',
      label_1: 'Seller',
      label_2: 'Order Amount',
      label_3: 'Unit Price',
      label_4: 'Quantity',
      label_5: 'Payment Reference Number',
      label_6: 'Order Number',
    },
    order: {
      title: 'Order Details',
      text_1: 'Information not found...',
      text_2: 'Failed',
      text_3: 'Buy',
      text_4: 'Sell',
      text_5: 'Order number：',
      warning: 'Unable to get data',
      status_0: 'Order initializing',
      status_1: 'Order pending payment...',
      status_2: 'Order completed',
      status_3: 'Order failed',
      status_4: 'Order expired',
    },
  },
  find: {
    title_1: 'Discover',
    title_2: 'Recommends',
    title_3: 'Popular',
    toast_1: 'Please login account',
    tip_1: 'Your game account balance',
    tabs_1: 'Dapp',
    tabs_2: 'information',
    tabs_3: '我的', // 增
    more: 'More',
    classification: 'Classify',
    thirdPart_Title: 'the page you visit will enter the third party\n' +
      'DApp《{0}》',
    thirdPart_Tip: 'Tip: the page you visit will enter the third party DAPP {0}. Your use behavior on the third party DAPP will apply to the third party DAPP\'s privacy policy and user agreement, and the responsibility will be borne by defibox directly and solely to you.',
    authorization: 'Account Authorization',
    text_1: 'Account name',
    text_2: 'Authorization matters',
    text_3: 'Request Login',
    share: 'Share',
    read_more: 'Read more',
    pack_up: 'Put away',
    friend: 'Friend circle',
    classify: {
      Hot: 'hot',
      Deal: 'transaction',
      Financial: 'financial management',
      Game: 'game',
      Movies: 'movies',
    },
    favorite: '我的收藏', // 增
    footprint: '我的足迹', // 增
    confrimFavorite: '确定要收藏该应用吗？', // 增
    confrimCancelFavorite: '确定要对该应用取消收藏吗？', // 增
    favoriteSuccess: '收藏成功', // 增
    cancelFavoriteSuccess: '取消收藏成功', // 增
    allDapp: '所有Dapps', // 增
  },
  assets: {
    title: '钱包', // 增
    history: 'History',
    text_1: 'Wallet Balance',
    text_2: 'Refresh',
    text_3: 'Deposit',
    text_4: 'Withdraw',
    text_5: 'Transfer',
    text_6: 'Available Credit',
    text_7: 'Not logged in',
    text_8: 'Log in',
    text_9: 'Transfer in',
    text_10: 'Transfer out',
    confirm: 'Confirm',
    transfer_1: 'Transfer in amount',
    transfer_2: 'Transfer out amount',
    transfer_3: '*This product support deposit only, unable to witdraw after deposit*',
    toast_1: 'Your wallet current balance is 0, you may transfer in to APP after you deposited to wallet',
    toast_2: 'Your APP balance are 0, unable to transfer out',
    toast_3: 'Transfer had been submitted！',
    toast_4: 'Current transaction status：',
    toast_5: 'Transfer failed！',
    status_1: 'New',
    status_2: 'In progress',
    status_3: 'Completed',
    status_4: 'Failed',
    message_1: 'Transfer from wallet balance {money} to {name}',
    message_1_1: 'Transfer from wallet balance',
    message_1_2: 'to',
    message_2: 'From {name} transfer {money} to wallet balance',
    message_2_1: 'From',
    message_2_2: 'transfer',
    message_2_3: 'to wallet balance',
  },
  deal: {
    title: 'Transaction History',
    title_2: 'Transaction Details',
    title_3: 'Send points',
    title_4: 'Confirm to send',
    title_5: 'Send successfully',
    text_1: 'Balance',
    text_2: 'User ID',
    text_3: 'Account Behavior',
    text_4: 'Execution time',
    text_5: 'Completion time',
    text_6: 'Status',
    text_7: 'Trading platform',
    text_8: 'User account',
    text_10: 'Quantity',
    placeholder_1: 'Please enter Tpay account',
    placeholder_2: 'Please enter the transfer user ID',
    placeholder_3: 'Please enter points',
    text_11: 'Send to',
    text_12: 'Send points',
    text_13: 'Remaining points',
    text_14: 'Procedure points',
    text_15: 'Next',
    text_16: 'Consumption points',
    text_17: 'Project',
    text_18: 'Points',
    text_19: 'to',
    text_20: 'Remarks',
    text_21: 'Payment method',
    text_22: 'Send points to',
    text_23: 'Current account balance',
    tip_1: 'Send more points than you can handle',
  },
  tip: {
    success: 'Success',
    fail: 'Failed',
    next: 'Next',
    confirm: 'OK to send',
    addSuccess: '新增成功', // 增
    addFail: '新增失败', // 增
    sendsuccess: 'Send success',
    sendfail: 'Send failed',
    complete: 'Complete',
    search: 'Search',
    send: 'Send',
    cancel: 'Cancel',
    savesuccess: 'Save successfully',
    savefail: 'Save failed',
    setSuccess: '设置成功', // 增
    setFail: '设置失败', // 增
    validSuccess: '验证成功', // 增
    validFail: '验证失败', // 增
    forcedLogOut: 'You have been forced to log out',
    logoutSuccess: 'Log out success',
    sessionExpire: 'The session has expired, please login again',
    deleteSuccess: '删除成功', // 增
    deleteFail: '删除失败', // 增
    submitSuccess: '提交成功', // 增
    submitFail: '提交失败', // 增
  },
  upload: {
    sizeLimit: 'The image size should not be larger than 2MB',
    typeLimit: 'It\'s not an image type',
  },
  chat: {
    title: 'Message',
    title_2: 'Address Book',
    title_3: 'New friend',
    title_4: 'Add friends',
    title_5: 'Receive QR Code',
    text_1: 'Announcement message',
    text_2: '[Receive points] Send you points',
    text_3: 'No news yet',
    text_4: 'New friend',
    text_5: 'Ignore',
    text_6: 'Agree',
    text_7: 'Added',
    text_8: 'Turn point',
    text_9: 'you',
    tips: 'The current session was not obtained',
    placeholder_1: 'Send message...',
  },
  my: {
    title: 'Me',
    text_1: 'Not logged in',
    text_2: 'log in',
    label_1: 'Wallet Management',
    label_2: 'Identity Verification',
    label_3: 'Invitation Code',
    label_4: 'System message',
    label_5: 'Help Center',
    label_6: 'Language',
    label_7: 'About',
    label_8: 'Download APK',
    label_9: 'Password management',
    label_10: 'OTC transactions',
    label_11: 'OTC payment method',
    label_currencyUnit: '货币单位', // 增
    lang: 'Language choice',
    download_1: 'Android',
    logout: 'Log Out',
    toast_1: 'Log in/Register',
    toast_2: 'Feature not available，stay tune',
    dialog_1: 'Exit Prompt',
    dialog_2: 'Are you sure want to exit？',
    dialog_3: 'Confirm',

    currencyUnit: {
      title: '货币单位', // 增
      CNY: '人民币', // 增
      USD: '美元', // 增
      TWD: '台币', // 增
      HKD: '港币', // 增
      JPY: '日圆', // 增
    },

    otcPayment: {
      title: 'Payment method',
      add: 'Add',
      tip: 'Please use your real name account',
      default: "默认", // 增
    },

    addChannel: {
      title: 'Add',
      clickTip: 'Click on the card to edit',
    },

    channelOption: {
      title: 'add {0}',
      modify: 'edit {0}',
      qrcode: 'money receiving QR code',
      optional: 'optional',
      save: 'Save',
      notNull: 'Can not be empty',
      Invalid: 'Invalid QR code',
      addFail: 'Except bank card, only one collection method can be owned',
      setAsDefalut: '设为默认帐户', // 增
      needChangeDefault: '请先更换默认帐户再进行删除操作', // 增
    },

    editInfo: {
      title: 'Edit information',
      head: 'Head portrait',
      nickname: 'Nickname',
      myInvitationCode: 'My invitation code',
      editNickName: 'Edit nickname',
      placeholder_1: 'Please enter a nickname',
    },

    Announcement: {
      title: 'System message',
      text_1: 'details',
      detail: 'Message details',
    },

    kyc: {
      title: 'Identity Verification',
      text_1: 'Individual Identity Verification',
      text_2: 'Completed Lv.1 Verification',
      text_3: 'Unverify',
      text_4: 'Lv.1 basic verification',
      text_5: 'Verified',
      text_6: 'Verify',
      text_7: 'under review',
      text_8: 'Lv. 2 advanced certification',
      text_9: 'failure',
      text_10: 'Completed Lv.2 Verification',
      default_text_7: 'Fiat Transaction allowed after verified ，Single transaction limit 2000 CNY',
      dgc_text_7: 'After the certification, you can turn the point, 24 hours limit of 10000, a single pen limit of 2000',
      beePal_text_7: 'you can withdraw the currency after authentication, and the 24-hour limit is 100 usdt',
      beePal_text_8: 'after authentication, you can trade in legal currency, with a single limit of 2000 CNY',
      beePal_text_9: 'after identity authentication, advanced authentication can be performed',
      beePal_text_10: 'after advanced authentication, a single transaction of more than 2000 CNY or a cumulative amount of more than 100000 CNY can be conducted',
      detail: {
        name: 'Name',
        account: 'Account',
        country: 'Country',
        cardNum: 'ID number',
      },
    },

    advanceAuth: {
      title: 'advanced certification',
      address: 'certificate issuing country / region',
      type: 'please select the type of certificate to be submitted',
      next: 'continue',
      title2: 'upload ID card',
      title3: 'upload passport',
      title4: 'holding the certificate',
      title_bill: '海外用户地址验证', // 增
      title_bank: '验证银行帐号', // 增
      description_bill: '由于您是海外用户，所以需要验证您的海外地址', // 增
      description_bank: '由于您是台湾用户，所以需要验证您的银行帐号', // 增
      bill: '水电费帐单', // 增
      bank: '存折封面', // 增
      bankNumber: '银行帐号', // 增
      bankNumber_placeholder: '请输入您的银行帐号', // 增
      foreignAddress: '海外地址', // 增
      tip_bill: '拍摄时请保持水电费帐单完整、字迹清晰、亮度均衡', // 增
      tip_bank_1: '户名必须与初级认证时候的一致', // 增
      tip_bank_2: '拍摄时请保持存折封面完整、字迹清晰、亮度均衡', // 增
      tip1: 'please upload / take ID photos and upload them as required',
      upload: 'shoot / upload',
      reupload: 're-upload ',
      cancel: 'Cancel upload',
      upload2: 'upload valid passport information page',
      portrait: 'portrait face',
      emblem: 'national emblem face',
      frontSide: '正面', // 增
      backSide: '背面', // 增
      tip2: 'please upload a. Jpg \ \ JPEG \ \ PNG image smaller than 5m',
      tip3: 'only used for {0} query center to verify identity',
      tip4: 'please keep the frame of your ID card intact, the handwriting clear and the brightness balanced when shooting',
      tip5: 'confirm upload audit, information cannot be changed during audit',
      tip6: 'please complete the basic authentication first',
      success: 'upload succeeded',
      fail: 'upload failed',
    },

    audit: {
      title: 'certificate verification',
      tip: 'all certificates have been uploaded successfully, please wait for verification',
      tip2: 'the audit time is generally 5-7 working days, please wait patiently.',
    },

    auth: {
      text_1: 'country',
      tip_1: 'Selected, it cannot be changed.',
      text_2: 'certificate type',
      text_3: 'certificate number',
      placeholder_1: 'please enter your ID number',
      placeholder_2: 'please enter your passport number',
      text_4: 'name',
      tip_2: '(ex: JiangBao)',
      text_5: 'middle name ',
      optional: '(optional)',
      text_6: 'last name',
      tip_3: '(ex: Li)',
      year: 'year',
      month: 'month',
      day: 'Day',
      tip_4: 'the name must be the same as the name of the bank account to be withdrawn in the future ',
      text_7: 'date of birth ',
      placeholder_3: 'please select the date of birth',
      text_8: 'residential address',
      title: 'basic authentication',
      action_title_1: 'select country information ',
      country_1: 'CN China',
      country_2: 'tw Taiwan ',
      country_3: 'HK Hong Kong',
      action_title_2: 'select certificate type ',
      certificate_1: 'ID card',
      certificate_2: 'passport',
      err_1: 'required items not filled in completely ',
      back: 'are you sure you want to return and give up authentication?',
      onauth: 'under review',
      authsuccess: 'audit completed',
      notice: 'certificate number verification error',
      submit: 'submit',
      fail: 'Failed to submit. Please confirm the correct input',
    },
    depositWithdraw: {
      tab_1: 'Deposit',
      tab_2: 'Witdraw',
      deposit: {
        text_1: 'Deposit Address',
        text_2: 'Copy',
        save: 'Save QR Code to gallery',
        tip_1: 'Please do not deposit any other digital assets except USDT to the above address.Otherwise, you may lose your assets permanently',
        tip_2: 'Depositing to the above address requires confirmations of the entire network.It will arrive after 12 confirmations, and it will be available to witdraw after 12 confirmations',
      },
      withdraw: {
        text_1: 'Witdraw address',
        input_1_1: 'Please input witdrawal',
        input_1_2: 'address',
        tip_1_1: '*Please ensure input the correct',
        tip_1_2: 'address，input address incorrectly will lose your assests permanently!',
        label_1: 'Amount',
        placeholder_1: 'Please input witdrawal address',
        button_1: 'All',
        tip_2: 'Balance',
        label_2: 'Fees',
        button_2: 'Witdraw',
        dialog_title: 'Confirm witdrawal address',
        dialog_1: 'Witdraw amount：',
        dialog_2: 'Actual amount transferred：',
        dialog_3: 'Fees：',
        text_2: 'Account balance',
        toast_1: 'Please reenter',
        toast_2: 'Please enter address',
        toast_3: 'Please enter amount',
        toast_4: 'Numeric only',
        toast_5: 'Input amount not exceed your balance',
        toast_6: 'Witdraw amount not lower than：',
        toast_7: 'Witdraw amount not exceed ：',
        toast_8: 'Submit Successfully',
        toast_9: 'Submit Failed',
      },
    },
    depositWithdrawHistory: {
      title: 'History',
      tab_1: 'Deposit / Witdraw',
      tab_2: 'Transfer',
      type_0: 'Deposit',
      type_1: 'Witdraw',
      label_1: 'Name',
      label_2: 'Amount',
      label_3: 'Fees',
      label_4: 'Address',
      label_5: 'Status',
      label_6: 'Transfer Type',
      text_1: 'No data',
    },
    myInvitationCode: {
      title_1: 'My Invitation Code',
      title_2: 'Direct scan QR Code to open invitation link',
      text_1: 'Copy Invitation Code',
      text_2: 'My Downline',
      title_3: 'User ID',
      text_3: 'Copy user ID',
      text_4: 'Scan the QR code pattern above to add as a friend',
    },
    payAccount: {
      title_1: 'Bind Account',
      title_2: 'Add bank Card',
      title_3: 'Payment Method',
      name: 'Name',
      bank_name: 'Bank Name',
      bank_address: 'Bank Branch',
      account_number: 'Bank Account Number',
      placeholder_1: 'Please enter bank account name',
      placeholder_2: 'Please enter bank card name',
      placeholder_3: 'Please enter bank account address',
      placeholder_4: 'Please enter bank card number',
      remove: 'Delete',
      removeSuccess: 'Successfully deleted',
      dialog_1: 'Are you sure you want to delete this payment method?',
      dialog_2: 'You have not bind your account',
      done: 'Done',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  },
  login: {
    text_1: 'Welcome log in',
    text_2: 'Logging in...',
    input_1: 'Please enter your account name',
    input_2: 'Please enter you password',
    input_email: '请输入邮箱帐号', // 增
    input_phone: '请输入手机号码', // 增
    button_1: 'Log in',
    button_2: 'Register',
    rule_1: 'Please enter your account name',
    rule_2: 'Please enter your password',
    rule_3: 'Password length 6-14 alphanumeric ',
    rule_4: 'Please enter registered mobile number',
    rule_5: 'Please enter correct mobile numner',
    rule_phone: '请输入正确的手机号码', // 增
    rule_email: '请输入正确的电子邮箱', // 增
    toast_1: 'Password incorrect, please enter again',
    forgetPassword: '忘记密码?', // 增
    email: '邮箱登入', // 增
    phone: '手机登入', // 增
  },
  register: {
    title_1: 'Register',
    title_2: 'Account',
    input_1: 'Create new account',
    input_password: 'Create new account password',
    input_confirmPassword: 'Please reconfirm password',
    input_phone: 'Mobile number',
    input_invitationCode: 'Invitation code',
    input_email: '邮箱', // 增
    input_validationCode: '验证码', // 增
    placeholder_email: '请输入邮箱验证码', // 增
    placeholder_phone: '请输入手机验证码', // 增
    placeholder_validationCode: '请输入六位数字验证码', // 增
    button_1: 'Register',
    button_2: 'Existing account , log in',
    button_email: '邮箱注册', // 增
    button_phone: '手机注册', // 增
    button_coolDown: '后重发', // 增
    country_china: '中国', // 增
    country_taiwan: '台湾', // 增
    country_hongKong: '香港', // 增
    rule_1: 'Please enter your name',
    rule_2: 'Please enter password',
    rule_3: 'Password length 6-14 alphanumeric',
    rule_4: 'Please enter correct password',
    rule_5: 'Password incorrect , please enter again',
    rule_6: 'Please enter mobile number',
    rule_7: 'Please enter correct mobile number',
    rule_8: 'Please enter correct email address',
    rule_9: 'Please enter invitation code',
    rule_10: 'Please enter valid invitation code',
    rule_validationCode: '请输入验证码', // 增
    toast_1: 'Congratualations! Registered successful !',
    toast_2: 'Invitation code invalid !',
    toast_3: 'Account name has been registered !',
    registerFail: '注册失败', // 增
    phoneOrEmailError: '邮箱或手机输入错误', // 增
    phoneError: '手机输入错误', // 增
    emailError: '邮箱输入错误', // 增
  },
  setPassword: {
    title: 'Change Password',
    old_password: 'Old Password',
    new_password: 'New Password',
    confirm_password: 'Confirm Password',
    placeholder_1: 'Enter old password',
    placeholder_2: 'Enter new password',
    placeholder_3: 'Confirm new password',
    rule_1: 'Please enter your password',
    rule_2: 'Password length should be 6-14 digits',
    rule_3: 'Entered password different , please re-enter again',
    toast_1: 'Password changed successfully',
    toast_2: 'Password does not match , please check again.',
    button_1: 'Confirm Change',
    setSecurityPassword: '安全密码设置', // 增
  },
  resetPassword: {
    title: '重置密码', // 增
    email: '邮箱', // 增
    phone: '电话', // 增
    placeholder_email: '请输入注册邮箱', // 增
    placeholder_phone: '请输入注册电话', // 增
    text_btn_find_email: '邮箱找回', // 增
    text_btn_find_phone: '电话找回', // 增
    button_nextStep: '下一步', // 增
  },
  securityValidation: {
    title: '安全验证', // 增
    email: '邮箱', // 增
    phone: '电话', // 增
    message_1: '将发送验证码到您的', // 增
    placeholder_email: '请输入邮箱验证码', // 增
    placeholder_phone: '请输入电话验证码', // 增
    placeholder_validationCode: '请输入六位数字验证码', // 增
    text_btn_find_email: '邮箱找回', // 增
    text_btn_find_phone: '电话找回', // 增
    button_submit: '提交', // 增
    button_reSend: '重新发送', // 增
  },
  beePal: {
    compony: '币蜂数位科技有限公司',
    tip: 'By signing in, you agree with beepal',
    userAgreement: 'User agreement',
    home: {
      wallet: 'My assets',
      assets: '钱包', // 增
    },
    tokenDetail: {
      title: 'Token details',
      all: 'whole',
      transfer: 'Transfer out',
      gathering: 'Collection',
      noRecord: 'No data available',
      noMore: 'No more',
      loading: 'Loading...',
      onprogress: 'Under confirmation',
      complete: '完成', // 增
      username: 'user name',
      error: 'fail',
      errorCoin: 'Wrong currency',
      pullingText: 'Drop down to refresh...',
      loosingText: 'Release to refresh...',
    },
    transfer: {
      title: '{0} transfer',
      field1: 'Collection address',
      payer: 'Payment account number',
      payee: '贴上钱包地址', // 增
      field2: 'Transfer out quantity',
      amount: 'Enter transfer out amount',
      field3: 'Balance',
      field4: 'Remarks',
      memo: 'Optional remarks',
      tips: 'Fill in the wrong may lead to asset losses, please check carefully',
      field5: 'Service Charge',
      field6: 'Quantity received',
      confirm: 'Confirm',
      success: 'Transfer submitted, waiting for confirmation',
      errorTip: 'The transfer out quantity should be greater than the handling fee',
      lightingTransfer: '0 handling charge for quick transfer',
      detailHead: 'transaction details',
      secondConfirm: 'Confirm payment',
      close: 'Close',
      outAmountWarning: 'Cannot exceed current balance',
      name: '收币者姓名', // 增
      address: '收币地址资讯', // 增
      addressType: '收币地址类型', // 增
      exchange: '交易所', // 增
      wallet: '钱包', // 增
      other: '其它', // 增
      purpose: '提币用途', // 增
      alreadyRead: '本人已详阅', // 增
      announcement: '防洗钱声明内容', // 增
      announcement_content: '亲爱的用户：<br><br>为了完成本次交易，您必须担保在提币过程中所留存的所有资料均为完整、正确、并与当时情况相符的资料，否则<span class="beepal-text">BeePal</span>有权拒绝或暂停本次交易<br><br>在下列情况发生时，<span class="beepal-text">BeePal</span>有权查看或提供您的个人资料给有权机关、或主张其权利受侵害并提出适当证明的第三人：<br><br>1.依法令规定、或依司法机关或其他有权机关的命令<br><br>2.未完成提币或执行本约定条款、或您违反本约定条款时', // 增
      placeholder_name: '请填写真实姓名', // 增
      placeholder_address: '请填写真实地址', // 增
      placeholder_purpose: 'ex: 投资, 储蓄, 借款...等', // 增
    },
    gathering: {
      title: '{0} collection',
      tip1: 'Scan QR code, turn to {0}',
      tip2: 'Charging address',
      tip3: 'Address label(Memo)',
      tip4: 'Please check and fill in the address label carefully. If the label is missing, the fund will be lost!',
      tip5: 'Wallet address',
      eosTip: 'Tips',
      eosTipContent:
        'Only when the address tag (memo) and the charging address are correctly filled in at the same time can the {0} be recharged to the beepal wallet. Missing the address tag or filling in the wrong address will lead to the loss of self check!',
      confirm: 'I got it!',
      btn1: 'Save QR code',
      btn2: 'Copy address',
      btn3: 'Copy label',
      copyFullMessage: '複製完整收款訊息', // 增
      fullMessage: '您好，請將{0}轉至"{1}"地址，謝謝！（Memo：{2}）', // 增
      fullMessageWithChian: '您好，請將{0}的{1}轉至"{2}"地址，謝謝！（Memo：{3}）', // 增
      none: '無' // 增
    },
    deal: {
      shortcut: 'Express',
      optional: 'Free zone',
      buy: 'I want to buy some coins',
      sell: 'I want to sell coins',
      noRecord: 'No data available',
      noCoin: '未拥有该币种钱包，正在产生中...请等待刷新', // 增
      notthrough: 'Cannot exceed balance',
      notCrossMax: 'The maximum limit cannot be exceeded',
      notCrossMaxAmount: '不能超过最大数量', // 增
      quota: 'Quota',
      num: 'Number',
      dealnum: 'Transaction',
      transRate: 'Turnover rate',
      price: 'Price',
      buyConfirm: 'Purchase',
      sellConfirm: 'Sell',
      buyCoin: 'Buy {0}',
      sellCoin: 'Sell {0}',
      collection: 'Collection method management',
      collectMethod: 'Payment method',
      auth: 'Authentication information',
      needAuthTip: 'Before the transaction, you need to complete the identity authentication',
      otcAuthTip: 'Identity authentication is required for OTC transactions',
      authNow: 'Certification now',
      openNow: 'activate now',
      openTip: 'You have not opened the collection method, please go to open it',
      cancel: 'Cancel',
      accordingToNum: 'Buy by quantity',
      accordingToReal: 'Buy by amount',
      sellByNum: 'Sold by quantity',
      sellByReal: 'Sold by amount',
      placeholder_real: 'Please input the purchase amount',
      placeholder_num: 'Please enter the purchase quantity',
      sellp_real: 'Please enter the selling amount',
      sellp_num: 'Please enter the quantity for sale',
      orderDetail: 'Transaction information',
      timeLimit: 'Time limit for payment',
      buyerName: 'Buyer\'s nickname',
      translateMode: 'transaction mode',
      miniute: '{0} minutes',
      comeSoon: 'Coming soon',
      countDown: 'Cancel in {0}s',
      placeOrder: 'place an order',
      outOfRange: 'Your transaction amount is not up to standard',
      overtime: 'Order confirmation time limit is 45 seconds. This confirmation has timed out. Please refresh and try again.',
      security: 'Security verification',
      passwordTip: 'Please input a password',
      forget: 'Forget the password',
      onprogress: 'Have in hand',
      complete: 'Completed',
      error: 'Fail',
      past: 'Expired',
      paid: '订单确认中', // 增
      undefined: '错误', // 增
      haveDeal: 'You already have a deal. You can\'t continue until you finish it',
      isMeBuyTip: 'You can\'t buy money from yourself',
      isMeSellTip: 'You can\'t sell money to yourself',
      unknownErr: 'An unknown error occurred',
      needAdvanceAuth: '通过高级认证后可交易', // 增
    },
    payment: {
      pay: 'Please pay',
      timeRemaining: 'Remaining time of payment',
      total: 'Total price',
      orderID: 'Order number',
      seller: 'Seller\'s nickname',
      method: 'Payment method',
      changeMethod: 'Choose payment method',
      bank: 'Bank',
      zfb: 'Alipay',
      wexin: 'Wechat',
      cancel: 'Cancellation of order',
      confirm: 'Go and pay',
      quit: 'Confirm cancellation of transaction',
      pullBack: 'Think again',
      tip: '99% of orders will be completed in 5 minutes',
      rule: 'Cancellation rules: there are 4 cancellations on the same day, which will limit the buying function on the same day.',
      notPayTip: 'I confirm that I have not paid to the other party yet',
      copySuccess: 'Copy succeeded',
      dealCanceled: 'Transaction cancellation',
      cancelTip: 'Order cancellation cannot view payment information',
      canceled: 'Order cancelled',
      certificate: '付款凭证', // 增
      uploadCertificate: '上传付款凭证', // 增
      orderPending: '等待卖家确认', // 增
    },
    payfor: {
      payfor: 'Payment to seller',
      paying: 'You are purchasing {1} {2} from a {0} certified seller',
      cashDeposit: 'Bond',
      certification: 'Merchant authentication',
      securedTransaction: 'Secured transactions',
      account_payment_bank: '银行户名', // 增
      account_payment_zfb: '支付宝实名', // 增
      account_payment_wexin: '微信实名', // 增
      cardNum_payment_bank: '银行帐号', // 增
      cardNum_payment_zfb: '支付保帐号', // 增
      cardNum_payment_wexin: '微信帐号', // 增
      bank: 'Bank of deposit',
      paymentQRcode: '收款码', // 增
      tips: 'Please pay the seller with your own bank card, otherwise all consequences will be borne by yourself.',
      paySuccess: 'I have paid successfully',
      quit: 'Confirm departure payment',
      tip: 'If you have paid the seller, please click "I have paid successfully" first',
      quitTip: 'Order will be cancelled after {0}',
      confirm: 'Confirm to leave',
      payConfirm: 'Payment confirmation',
      confirmTip: 'Please confirm that you have paid the seller',
      maliciousClick: 'Malicious click will directly freeze the account',
    },
    lastLap: {
      waitConfirm: 'Waiting for the seller to confirm',
      tip: '99% of orders will be completed in 5 minutes',
      appeal: 'Appeal',
      success: 'Successful transaction',
      confirmed: 'The seller has confirmed',
      confirmTip: '{0} {1} has been deposited in your wallet',
      quitTip: 'If you have paid to the seller, please cancel the order, otherwise it may cause property damage! ',
      quitTip2: 'Any loss arising therefrom shall be borne by the buyer.',
      check: 'I confirm that I haven\'t paid the other party, and I know the advantages and disadvantages.',
      checkTheBalance: 'View assets',
      back: 'Return to home page',
      time: 'Order time',
    },
    appeal: {
      reason: 'Reason for appeal',
      one: 'I have completed the payment and the seller has not released it in time',
      two: 'I transferred more money to the seller',
      three: 'Others',
      remind: 'Transaction reminder',
      placeholder: 'Please enter the details of the appeal',
      confirm: 'Submit application',
      content:
        'After filing a complaint, the assets will be frozen, and the Ombudsman will access the transaction until the end of the complaint. Malicious appeal belongs to the behavior of disturbing the normal operation order of the platform, and the account will be frozen if the circumstances are serious.',
    },
    recentTrans: {
      title: 'Recent transfer',
    },
    waiting: {
      title1: 'The buyer is paying',
      title2: 'Please confirm the receipt',
      tip2: 'The other party has marked payment successful, please confirm collection',
      buyer: 'Buyer\'s nickname',
      buyerRealname: 'Buyer\'s real name',
      confirm: 'I confirm receipt of payment',
      check2: 'I\'m sure I don\'t want to sell it',
      modal1: 'Confirm release',
      content1: 'Please be sure to login the online bank or the third party payment account to confirm the receipt of the payment',
      permitThrough: 'Released',
      check1: 'I confirm that I have logged into the collection account and checked that the collection is correct',
      successTip: 'You have successfully sold {0} {1}',
    },
    otcHistory: {
      buy: 'purchase',
      sell: 'Sold',
      buyCoin: 'Buy {0}',
      sellCoin: 'Sold {0}',
      error: 'Failed to get address',
    },
    trade: {
      overview: '总览', // 增
      sellOffer: '出售出价', // 增
      buyOffer: '买入出价', // 增
      closeAllOffer: '关闭所有出价', // 增
      createNewOffer: '创建新的出价', // 增
      createOffer: '创建出价', // 增
      needSetDefaultOTCPayment: '需要先设置默认收款方式', // 增
      needAdvancedAuth: '广告商需要高级认证', // 增
      editTradeMessage: '编辑出价将改变交易信息，确定要编辑吗？', // 增
      deleteTradeMessage: '删除出价其他人将无法继续跟您交易，确定要关闭吗？', // 增
      nextStep: '下一步', // 增
      offerDetail_title: '填写支付讯息', // 增
      offerPrice_title: '填写交易价格', // 增
      offerPrice_tip: '99%的商家会选择 30分钟以上 的交易等待时间', // 增
      offerAuth_title: '填写验证讯息', // 增
      offerConfirm_title: '确认讯息', // 增
      changeCoin: '选择加密货币', // 增
      changeType: '选择出价方式', // 增
      changePayment: '选择支付/收款方式', // 增
      changeCurrency: '选择支付/收款货币', // 增
      changeCurrencyDescription: '请确保所选币种是当前收/付款方式所支持的，否则将无法进行交易', // 增
      tradeFee: '广告费', // 增
      walletBalance: '钱包余额', // 增
      goCredit: '去充值', // 增
      noEnoughFee: '钱包余额不足以支付广告费', // 增
      sell: '出售', // 增
      buy: '购买', // 增
      orderStatus: '订单状态',
      orderStatus_description: '点击列表查看详情', // 增
      coinType: '币种', // 增
      allStatus: '全部状态', // 增
      time: '时间', // 增
      buyOrSell: '买/卖', // 增
      orderAmount: '数量', // 增
      price: '单价', // 增
      orderStatus_sell: '卖', // 增
      orderStatus_buy: '买', // 增
      orderStatus_1: '等待付款', // 增
      orderStatus_2: '成功', // 增
      orderStatus_3: '取消', // 增
      orderStatus_4: '取消', // 增
      orderStatus_5: '等待放币', // 增
      slideToView: '下滑查看', // 增
      amount: '出售额度', // 增
      nowBalance: '当前可用余额', // 增
      rate: '交易费率', // 增
      fixedPrice: '固定价格', // 增
      fixedPrice_label: '固定出价价格', // 增
      marketPrice: '市价', // 增
      marketPrice_label: '出价差额（每笔交易）', // 增
      minLimit: '最低限额', // 增
      maxLimit: '最高限额', // 增
      timeLimit: '出价时间限制', // 增
      timeUnit: 'min',
      rateUnit: '%',
      needAdvanceAuth: '交易伙伴需要通过高级身分认证', // 增
      dealCount: '交易次数要求', // 增
      newUserLimit: '新用户限额', // 增
      paymentDetail: '支付信息', // 增
      orderNumber: '订单号', // 增
      orderCoin: '加密货币', // 增
      orderType: '购买/出售', // 增
      orderMethod: '支付方式', // 增
      orderBank: '开户行', // 增
      orderBankNumber: '银行卡号', // 增
      orderCurrency: '首选货币', // 增
      priceDetail: '价格信息', // 增
      orderRate: '交易费率', // 增
      orderMinLimit: '最低限额', // 增
      orderMaxLimit: '最高限额', // 增
      orderPrice: '出价价格', // 增
      orderDifferent: '出价差额', // 增
      orderTimeLimit: '出价时间限制', // 增
      authDetail: '验证信息', // 增
      orderAuth: '交易限制', // 增
      normalAuth: '基础验证', // 增
      advanceAuth: '高级验证', // 增
      orderCount: '交易次数要求', // 增
      orderNewUserLimit: '新用户限额', // 增
      confirmAndSubmit: '确认并发布', // 增
      offerSuccess_title: '恭喜', // 增
      offerSuccess_content: '您的出价已创建成功！', // 增
      offerSuccess_edit_content: '更新出价成功！', // 增
      updateTrade: '更新出价', // 增
      continueOffer: '继续出价', // 增
      backToHome: '返回首页', // 增
      successTrade: '最成功的出价', // 增
      successTradeDescription: '按成交率计算的最佳出价', // 增
      failTrade: '最失败的出价', // 增
      failTradeDescription: '按成交率计算的最少出价', // 增
      cancelTrade: '已取消', // 增
      expiredTrade: '已过期', // 增
      recentTrade: '最近5笔交易', // 增
      recentTrustUser: '最近的可信的5个用户', // 增
      month: '月', // 增
      profit: '收益', // 增
      totalProfit: '总收益', // 增
      balance: '余额', // 增
      tradeAmout: '交易额', // 增
      deal: '交易', // 增
      totalAmount: '总额', // 增
      sellAndBuyTotal: '出售与购买总额为', // 增
      successDeal: '成功交易', // 增
      dealUnit: '笔交易', // 增
      dealRate: '交易率', // 增
      successDealRate: '交易率', // 增
      successDealRateDescription: '出售和购买成功的比例', // 增
      monthSiwtch: '月份切换', // 增
      dealRateTotal: '出售和购买整体成交率为', // 增
      payment: '收款方式', // 增
      firstChoosePayment: '首选收款方式', // 增
      placeholder_fixedPrice: '请输入固定出价价格', // 增
      placeholder_marketPrice: '请输入出价差额', // 增
      placeholder_minLimit: '请输入出价交易最低限额', // 增
      placeholder_maxLimit: '请输入出价交易最高限额', // 增
      placeholder_timeLimit: '请输入出价时间限制', // 增
      placeholder_dealCount: '请输入交易次数要求', // 增
      placeholder_newUserLimit: '请输入新用户限额', // 增
      placeholder_amount: '请输入要出售的货币额度', // 增
    },
  },
  lesson: {
    card_title: '课程专栏', // 增
    lesson_type: '类型', // 增
    lesson_type_all: '全部', // 增
    lesson_type_text: '文章', // 增
    lesson_type_video: '视频', // 增
    lesson_type_audio: '音频', // 增
    sectionTime: '课时', // 增
    hour: '小时', // 增
    free: '限时免费', // 增
    lessonCatalog: '课程目录', // 增
    lessonTime: '课程时长', // 增
    lessonPrice: '课程价格', // 增
    lessonName: '课程名称', // 增
    lessonType: '课程类型', // 增
    confirmPay: '确认支付', // 增
    buyDetail: '交易详情', // 增
    buySuccess: '购买成功', // 增
    buySuccessDescription: '快去开启您的学习之旅吧', // 增
    close: '关闭', // 增
    share: '分享', // 增
    buy: '购买', // 增
    securityValidation: '安全验证', // 增
    securityValidationCode: '安全验证码', // 增
    needToBuy: '购买后才可查看', // 增
    packUp: '收起', // 增
    alreadyLearn: '已学习', // 增
  },
  defaultPage: {
    networkError: {
      title: '网络开小差了', // 增
      description: '请检查网络设置或稍后再试', // 增
    },
    emptyContent: {
      title: '暂无相关内容', // 增
      description: '快去添加吧', // 增
    },
    emptyResult: {
      title: '未搜索到指定内容', // 增
      description: '换个关键词试试', // 增
    },
    emptyMessage: {
      title: '暂无消息', // 增
      description: '还没有留言哦', // 增
    },
  }
}
