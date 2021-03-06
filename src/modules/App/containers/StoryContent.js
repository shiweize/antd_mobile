/**
 * 创建人： ludan
 * 创建模块：主页
 * 创建时间：2018-06-24
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Card, WhiteSpace, Icon, SearchBar, Flex, NavBar } from "antd-mobile";
import * as Path from 'constants/storePath';
import style from 'styles/app.scss';
import { fetchStoryList, deleteStoryItem } from '../actions/story';
import { COMMENT_AGREE } from 'constants/constants';

class StoryContent extends Component {
  constructor () {
    super();
    this.shareStory = this.shareStory.bind(this);
    this.state = {
      commentType: COMMENT_AGREE
    };
  }

  shareStory () {
    this.props.history.push('/editor');
  }

  async onDeleteStoryItem (articleId) {
    await this.props.deleteStoryItem({ articleId });
    await this.props.fetchStoryList();
  }

  async componentDidMount () {
    await this.props.fetchStoryList();
  }

  render () {
    const { storyList=[] } = this.props;
    if (!storyList) return;
    const cardList = storyList.map(item => {
      return (
        <div key={item.articleId}>
          <WhiteSpace size="xs"/>
          <Card full>
            <Card.Header
              title={item.title}
              extra={<Icon type="delete" size="small" onClick={() => this.onDeleteStoryItem(item.articleId)}/>}
            />
            <Card.Body>
              <div>{item.content}</div>
            </Card.Body>
            <Card.Footer
              content={
                <div>
                  <Icon
                    type={ this.state.commentType === COMMENT_AGREE ? "good-o" : "good" }
                    size="small"
                    style={{ marginRight: '0.1rem' }}/>
                  <Icon className={style.badIconStyle} type="good" size="small"/>
                </div>}
            />
          </Card>
        </div>
      );
    });
    return (
      <div>
        <NavBar mode="dark" onLeftClick={this.goBack}>首页</NavBar>
        <SearchBar placeholder="搜索文章、作者" maxLength={8}/>
        <WhiteSpace size="xs"/>
        <Flex style={{ background: 'white' }}>
          <Flex.Item>
            <div className={style.link} onClick={this.shareStory}>
              分享故事
            </div>
          </Flex.Item>
          <Flex.Item>
            <div className={style.link}>
            </div>
          </Flex.Item>
          <Flex.Item>
            <div className={style.link}>
            </div>
          </Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <div>
          { cardList }
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const storyStorePath = ['app', Path.STORY_REDUCER];
  return {
    storyList: state.getIn([...storyStorePath, Path.STORY_LIST])
  };
}

function mapDispatchToProps (dispatch) {
  return {
    fetchStoryList: (payload) => dispatch(fetchStoryList(payload)),
    deleteStoryItem: (payload) => dispatch(deleteStoryItem(payload))
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryContent));
