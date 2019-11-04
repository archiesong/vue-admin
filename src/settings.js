module.exports = {
  /**
   * @type {string} anystring
   * @description app title
   */
  title: 'Vue Element Admin',
  /**
   * @type {number}  1
   * @description token Cookie Expires
   */
  tokenCookieExpires: 1,
  /**
   * @type {number}  1
   * @description  default Cookie Expires
   */
  defaultCookieExpires: 1,
  /**
   * @type {string} any
   * @description token key
   */
  tokenKey: 'ADMIN-TOKEN',
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,
  /**
   * @type {array}
   * @description system default roles
   */
  systemDefaultRole: ['GUEST'],
  /**
   * @type {array}
   * @description system theme
   */
  theme: [
    {
      title: '默认',
      name: 'Default',
      top: 'rgba(255,255,255,1)',
      slide: 'rgba(48, 65, 86,1)',
      logo: 'rgba(43, 47, 58,1)',
      backgroundImage: ''
    },
    {
      title: ' 经典',
      name: 'Classic',
      top: 'rgba(255,255,255,1)',
      slide: 'rgba(32,34,42,1)',
      logo: 'transparent',
      backgroundImage: ''
    },
    {
      title: '深蓝色',
      name: 'Darkblue',
      top: 'rgba(255,255,255,1)',
      slide: 'rgba(3,21,42,1)',
      logo: 'transparent',
      backgroundImage: ''
    },
    {
      title: '光亮色',
      name: 'Light',
      top: 'rgba(255,255,255,1)',
      slide: 'rgba(255,255,255,1)',
      logo: 'rgba(255,255,255,1)',
      backgroundImage: ''
    },
    {
      title: '简约线条',
      name: 'Line',
      top: 'rgba(255,255,255,1)',
      slide: 'rgba(255,255,255,0.1)',
      logo: 'rgba(255,255,255,0.1)',
      backgroundImage: 'line-bg.jpg'
    },
    {
      title: '流星',
      name: 'Star',
      top: 'rgba(255,255,255,0.1)',
      slide: 'rgba(255,255,255,0.1)',
      logo: 'rgba(255,255,255,0.1)',
      backgroundImage: 'star-bg.jpg'
    }
  ],
  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
