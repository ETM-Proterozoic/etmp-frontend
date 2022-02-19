import styled from 'styled-components'

export const StakingPage = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .staking-page {
    width: 100%;
    max-width: 1300px;
    margin: auto;
    padding: 0 30px 30px 30px;
    box-sizing: border-box;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 30px;
    `}
    h1.banner {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 500;
      font-size: 36px;
      line-height: 42px;
      color: ${({ theme }) => theme.text1};
      span {
        color: #0397f3;
      }
    }
  }
  .card {
    background: ${({ theme }) => theme.bg1};
    box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.1), 0px 4px 20px -2px rgba(50, 50, 71, 0.08);
    border-radius: 20px;
    overflow: hidden;
    .card-title {
      padding: 20px 32px;
      border: 1px solid #f2f2f2;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 116%;
      color: #000000;
    }
    .card-main {
      padding: 10px 32px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      .card-main-item {
        padding: 16px;
        & > .card-title {
          font-family: Nunito Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 22px;
          color: #4e5969;
          display: flex;
          align-items: center;
          img {
            width: 16px;
            height: 16px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
        & > h1 {
          font-family: Nunito Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 26px;
          line-height: 34px;
          /* identical to box height, or 131% */
          color: #1d2129;
        }
        & > .card-desc {
          font-family: Nunito Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          color: #4e5969;
          margin: 8px 0px;
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
    height: 45px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 25px;
    color: #ffffff;
    cursor: pointer;
  }
  .btn-compound {
    width: 133px;
    background: #017bff;
    margin: 0px 20px;
  }
  .all-validators {
    table {
      border-spacing: 0;
      width: 100%;
      margin-bottom: 20px;
      tr {
        th {
          text-align: left;
          padding: 0 20px;
        }
        td {
          &:nth-last-child(1) {
            width: 200px;
            & > div {
              display: flex;
            }
          }
        }
        &.table-header {
          height: 44px;
          background: #f2f2f2;
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
            font-size: 18px;
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
                margin-right: 20px;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }

  .btn-claim {
    width: 89px;
    background: linear-gradient(225deg, #29272e 0%, #27272e 100%);
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding-top: 20px;
    `}
`
