import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setArticlesData } from "../../actions/setArticlesData";
import { setArticleEditState } from "../../actions/setArticleEditState";
import { setCurrentArticleEntry } from "../../actions/setCurrentArticleEntry";
import { setCurrentViewArticle } from "../../actions/setCurrentViewArticle";
import { Route, Switch } from 'react-router-dom';
import ArticleEntry from "./ArticleEntry";
import ArticleEntryForm from './ArticleEntryForm';
import ArticleProfile from './ArticleProfile';
import axios from "axios";
import './articles.css';

class Articles extends Component {
  constructor(props) {
    super(props);
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  async componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    
    this.config.headers.authorization = await localStorage.getItem('token');
    this.props.setArticleEditState('0');
    this.props.setCurrentViewArticle('0');
    const { data } = await axios.get(`${this.REST_URL}/api/articles/fetchAllArticles/${localStorage.getItem('propertyId')}`, this.config);
    await this.props.setArticlesData(data);
  }

  async onAddHandler() {
    await this.props.setCurrentArticleEntry({});
    await this.props.setArticleEditState('1');
    
  }

  async onCancelHandler() {
    await this.props.setArticleEditState('0');
  }

  render() {
    return (
      <div>
        {this.props.currentViewArticle === '0' && this.props.articleEditState === '0' ? 
          <h3 className="title" align="center">NEWS</h3> 
          : 
            null
          }
          {this.props.articleEditState === "0" &&
          localStorage.getItem('type') === '1' && this.props.currentViewArticle === '0' ? (
            <div align="center">
              <button className="btn-cits" onClick={this.onAddHandler.bind(this)}>CREATE NEW ARTICLE</button>
            </div>
          ) : null}
          <br/>
        <div className="container">
                {localStorage.getItem('type') === '1' ? (
                  this.props.currentArticleEntry &&
                  this.props.articleEditState !== '0' ? (
                    <div>
                      <ArticleEntryForm data={this.props.currentArticleEntry}  />
                      <br/>
                      <div align="center">
                        <button className="col-md-3 btn-cits bottom" align="center" onClick={this.onCancelHandler.bind(this)}>Cancel</button>
                      </div> 
                    </div>
                  ) : 
                  this.props.articlesData && this.props.currentViewArticle === '0' ? (
                    <div className="row">
                      
                      {this.props.articlesData.map(article => {
                        return <ArticleEntry article={article} key={article.id} />;
                      })}
                    </div>
                  ) : (
                    <div>
                      <Route path='/' component={ArticleProfile}/>
                      {/* <ArticleProfile/> */}
                    </div>
                  )
                ) : this.props.articlesData && this.props.currentViewArticle === '0'? (
                  <div className="row">
                  {this.props.articlesData.map(article => {
                    return <ArticleEntry article={article} key={article.id} />;
                  })}
                  </div>
                ) : (
                  <div>
                    <Route path='/' component={ArticleProfile}/>
                      {/* <ArticleProfile/> */}
                  </div>
                )}
          </div>

      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    articlesData: state.articlesData,
    currentArticleEntry: state.currentArticleEntry,
    articleEditState: state.articleEditState,
    currentProperty: state.currentProperty,
    currentViewArticle: state.currentViewArticle,
    currentArticlePosts: state.currentArticlePosts
  };
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setArticlesData: setArticlesData,
      setCurrentArticleEntry: setCurrentArticleEntry,
      setArticleEditState: setArticleEditState,
      setCurrentViewArticle: setCurrentViewArticle
    },
    dispatch
  );
};

export default connect(mapStateToProps, matchDispatchToProps)(Articles);
