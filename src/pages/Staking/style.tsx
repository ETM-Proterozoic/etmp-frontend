import styled from 'styled-components'

export const StakingPage = styled.div<{ bg: any }>`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-image: url(${({ bg }) => bg});
  background-size: 100% 100%;

  .staking-page {
    width: 100%;
    max-width: 1440px;
    margin: auto;
    padding: 50px 30px 30px 50px;
    box-sizing: border-box;

    ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 20px;
    `}
    .banner {
      position: relative;
      display: flex;
      min-height: 395px;
      div {
        &:nth-child(1) {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-top: 50px;
          h1 {
            font-family: DINMittelschrift;
            font-size: 60px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 67px;
            letter-spacing: -3px;
            color: #2d316a;
            margin: 10px 0;
            span {
              display: inline;
              color: #fb4d7d;
            }
            ${({ theme }) => theme.mediaWidth.upToMedium`
            font-size: 40px;
            line-height: 47px;
          `}
          }
          p {
            margin: 0;
            .banner-btn {
              //width: 220px;
              height: 40px;
              padding: 10px 10px 10px 20px;
              background: #1364ff;
              color: ${({ theme }) => theme.white};
              border-radius: 20px;
              display: flex;
              align-items: center;
              border: 0;
              white-space: nowrap;
              cursor: pointer;
              margin-top: 30px;
              span {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: white;
                margin-left: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                  width: 18px;
                  height: 18px;
                }
              }
            }
          }
        }

        &:nth-last-child(1) {
          position: absolute;
          right: 0;
          z-index: -1;
          img {
            max-width: 100%;
            max-height: 400px;
            ${({ theme }) => theme.mediaWidth.upToMedium`
            opacity: 0.5;
          `}
          }
        }
      }
    }
  }
  .all-validators-h5 {
    display: none;
    padding: 10px;
    & > div {
      border-bottom: 1px solid #f0f0f0;
      margin: 10px 0;
      padding: 10px 0;
    }
    .all-validators-h5-t {
      display: flex;
      margin-bottom: 10px;
      & > div {
        &:nth-child(1) {
          flex: 1;
          display: flex;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            margin-right: 5px;
          }
        }
        &:nth-last-child(1) {
          display: flex;
          flex-direction: column;
          & > div {
            margin: 5px;
          }
        }
      }
    }
    .all-validators-h5-v {
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: center;
      h2 {
        font-size: 14px;
        font-weight: normal;
        color: #afafaf;
      }
    }
    .all-validators-h5-b {
      display: flex;
      align-items: center;
      & > div {
        flex: 1;
        padding: 10px;
        & > div {
          width: 100%;
        }
      }
    }
    ${({ theme }) => theme.mediaWidth.upToMedium`
   display: block;
    `}
  }
  .all-validators-pc {
    ${({ theme }) => theme.mediaWidth.upToMedium`
   display: none;
    `}
  }
  .account-data {
    margin-top: -50px;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0px;
    `}
  }

  .card {
    background: ${({ theme }) => theme.bg1};
    //box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.1), 0px 4px 20px -2px rgba(50, 50, 71, 0.08);
    border-radius: 10px;
    overflow: hidden;

    .card-title {
      border-bottom: 1px solid #f2f2f2;
      padding: 0 32px;
      ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 0 20px;
      `}
      span {
        font-family: NotoSansCJK-Regular;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 116%;
        color: #061024;
        padding: 20px 0;
        display: inline-block;
        height: 100%;
        border-bottom: 4px solid #017bff;
        ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 15px 0;
        font-size: 16px;
      `}
      }
    }

    .card-main {
      padding: 10px 32px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr 1fr;
    `}
      ${({ theme }) => theme.mediaWidth.upToSmall`
         padding: 10px 0px;
      `}
      .card-main-item {
        padding: 16px;

        & > .card-main-title {
          font-family: NotoSansCJK-Regular;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 22px;
          color: #afafaf;
          display: flex;
          align-items: center;
          margin: 0;
          padding: 0;
          ${({ theme }) => theme.mediaWidth.upToSmall`
          font-size: 12px;
        `}
          img {
            width: 18px;
            height: 18px;
            margin-left: 10px;
            cursor: pointer;
          }
        }

        & > h1 {
          font-family: NotoSansCJK-Regular;
          font-style: normal;
          font-weight: 600;
          font-size: 24px;
          margin: 5px 0;
          /* identical to box height, or 131% */
          color: #1d2129;
          ${({ theme }) => theme.mediaWidth.upToSmall`
          font-size: 16px;
        `}
        }

        & > .card-desc {
          font-family: NotoSansCJK-Regular;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          color: #afafaf;
          margin: 0;
          ${({ theme }) => theme.mediaWidth.upToSmall`
          font-size: 12px;
        `}
        }
      }

      .card-main-item-btns {
        display: flex;
        align-items: center;
      }
    }
  }

  .network-overview,
  .all-validators {
    margin-top: 32px;
  }

  .btn-compound,
  .btn-claim {
    padding: 6px 20px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
  }

  .btn-compound {
    background: #017bff;
    margin-right: 15px;
  }

  .all-validators {
    table {
      border-spacing: 0;
      width: 100%;
      margin: 20px;

      tr {
        th {
          text-align: left;
          padding: 0 20px;
          box-sizing: border-box;
        }

        td {
          &:nth-last-child(1) {
            width: 220px;
            padding: 0 10px;
            box-sizing: border-box;
            & > div {
              display: flex;
            }
          }
        }

        &.table-header {
          height: 44px;
          color: #afafaf;
          th {
            font-weight: normal !important;
          }
        }

        &.content-tr {
          padding: 12px;

          td {
            padding: 0 20px;
            height: 68px;
            min-height: 68px;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 25px;

            &:nth-child(1) {
              font-family: PingFang SC;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              color: #000000;

              div {
                display: flex;
                align-items: center;
              }

              img {
                width: 48px;
                height: 48px;
                margin-right: 10px;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }

  .btn-claim {
    //width: 89px;
    background: linear-gradient(225deg, #29272e 0%, #27272e 100%);
    margin-right: 20px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding-top: 20px;
    `}
`
