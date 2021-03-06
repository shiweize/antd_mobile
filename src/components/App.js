import React, { Component } from "react";
import { routes } from '../routes';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TabBar, Icon } from 'antd-mobile';
import { TAB_ITEM_STORY, TAB_ITEM_PROFILE } from 'constants/constants';
// import dashboard from "styles/dashboard.scss";

class App extends Component {
  constructor () {
    super();
    this.onTabItemChange = this.onTabItemChange.bind(this);
    this.getNowDom = this.getNowDom.bind(this);
    this.state = {
      selectedTab: TAB_ITEM_STORY,
    };
  }

  onTabItemChange (tabItem) {
    this.setState({
      selectedTab: tabItem,
    });

    switch (tabItem) {
    case TAB_ITEM_STORY:
      this.props.history.push(`/${TAB_ITEM_STORY}`);
      break;
    case TAB_ITEM_PROFILE:
      this.props.history.push(`/${TAB_ITEM_PROFILE}`);
      break;
    }
  }

  getNowDom () {
    const { selectedTab } = this.state;
    const hashUrlBool = window.location.hash === '#/';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '6.7rem' }}>
        <div style={{ flex: '1' }}>
          {routes}
        </div>
        <div style={{ height: '60px' }}>
          {
            hashUrlBool ? 
              null 
              :
              <TabBar
                unselectedTintColor="#949494"
                tintColor="#01A982"
                barTintColor="white">
                <TabBar.Item
                  icon={<Icon type="index" size="lg"/>}
                  selectedIcon={<Icon type="index-o" size="lg"/>}
                  title="段子"
                  key="段子"
                  data-seed="logId1"
                  selected={selectedTab === TAB_ITEM_STORY}
                  onPress={() => this.onTabItemChange(TAB_ITEM_STORY)}>
                </TabBar.Item>
                <TabBar.Item
                  icon={<Icon type="notification" size="lg"/>}
                  selectedIcon={<Icon type="notification-o" size="lg"/>}
                  title="通知"
                  key="通知"
                  data-seed="logId1"
                  selected={selectedTab === 'tab3'}
                  onPress={() => {
                    this.setState({
                      selectedTab: 'tab3',
                    });
                  }}>
                </TabBar.Item>
                <TabBar.Item
                  icon={<Icon type="account" size="lg"/>}
                  selectedIcon={<Icon type="account" size="lg"/>}
                  title="我的"
                  key="我的"
                  data-seed="logId1"
                  selected={selectedTab === TAB_ITEM_PROFILE}
                  onPress={() => this.onTabItemChange(TAB_ITEM_PROFILE)}>
                </TabBar.Item>
              </TabBar>
          }
        </div>
      </div>
    );
  }

  render () {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {this.getNowDom()}
      </div>
    );
  }
}

function mapStateToProps (state) {
  // const appStorePath = ['app', Constants.APP_REDUCER];
  return {

  };
}

function mapDispatchToProps (dispatch) {
  return {

  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
