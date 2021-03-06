import React from "react"
import { navigate } from "gatsby"
import PropTypes from "prop-types"
import * as queryString from "query-string"
import { handleLogin } from "../services/auth"
import { fetchContent } from "../services/fetch"
import Layout from "../components/layout"
import SEO from "../components/seo"

class Login extends React.Component {
  state = {
    authed: false,
    dataReady: false,
    error: false,
    jwt: "",
  }

  async componentDidMount() {
    const { jwt } = queryString.parse(this.props.location.search)
    if (jwt) {
      handleLogin(jwt)
      this.setState({
        authed: true,
      })
      let content = await fetchContent(jwt)
      if (content === null) {
        this.setState({
          error: "No Lambda URL was specified",
        })
        return null
      }
      this.setState({
        dataReady: true,
      })
    } else {
      this.setState({
        authed: false,
        dataReady: false,
        jwt: null,
      })
    }
  }
  render() {
    if (this.state.dataReady === true) {
      setTimeout(() => {
        navigate(`/`)
      }, 3000)
    } else if (
      JSON.parse(
        typeof window !== "undefined" &&
          window.localStorage.getItem("data") &&
          !this.state.dataReady
      )
    ) {
      navigate(`/`)
    }
    const { jwt } = queryString.parse(this.props.location.search)
    return (
      <Layout>
        <SEO title="Home" />
        <div className="container content center margin">
          {!jwt ? (
            <span>Invalid Request</span>
          ) : !this.state.authed ? (
            <span>Authenticating...</span>
          ) : this.state.error ? (
            <span>{this.state.error}</span>
          ) : (!this.state.authed && !this.state.error) ||
            this.state.dataReady === false ? (
            <span>Downloading Private Data...</span>
          ) : (
            <span>
              Done!... now you will be redirected back to the home page!
            </span>
          )}
        </div>
      </Layout>
    )
  }
}
Login.propTypes = {
  location: PropTypes.object,
}
export default Login
