import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"

const Article = ({ data, location } : any) => {
  /* 
  console.log(location.state.title)
  */
  console.log(location)
  console.log(data)
  // console.log(data.allMarkdownRemark.edges)
  // const article = data.markdownRemark
  return(
    <Layout>
      <h1>
          個別ぺーじだよ
      </h1>
      <div
        dangerouslySetInnerHTML={{ __html: data.markdownRemark.html}}
      />
      <Link to='/'>
        記事一覧へ
      </Link>
    </Layout>
  )
}

export const query = graphql`
  query Article($slug: String!){
    markdownRemark(
      fields: {slug: {eq: $slug}}
    ) {
        html
    }
  }
`

export default Article