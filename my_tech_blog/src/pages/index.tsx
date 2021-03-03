import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }: any) => {
  /* console.log(data) */
  return (
    <Layout>
      <SEO title="Home" />
      {data.allMarkdownRemark.edges.map((file: any, index: number) => {
       return(
         <div key={index}>
           <p>
            {file.node.frontmatter.title ? 
              <Link
                to={`/article/${file.node.frontmatter.date}`}
                state={{title: file.node.frontmatter.title}}
              >
                {file.node.frontmatter.title}
              </Link>
              :
              <span>
                タイトルなし
              </span>
            }
            </p>
            <p>
              {file.node.frontmatter.tag ?
                <span>
                  {file.node.frontmatter.tag}
                </span>
                :
                <span>
                  未分類
                </span>
              }
            </p>
            <p>
              {file.node.frontmatter.date ?
               <span>
                 {file.node.frontmatter.date}
                </span>
                :
                <span>
                  日付なし
                </span>
              }
            </p>
          <hr/>
         </div>
      )
      })}
    </Layout>
  )
}

export default IndexPage


export const query = graphql`
  query MarkdownList{
    allMarkdownRemark (
      sort: {fields: frontmatter___date}
    ){
      edges {
        node {
          html
          headings {
            depth
            value
          }
          frontmatter {
            # Assumes you're using title in your frontmatter.
            title,
            date,
            tag
          }
        }
      }
    }
  }
`