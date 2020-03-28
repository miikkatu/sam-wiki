const wiki = require('wikijs').default;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const getWikiContent = async (wikiPage) => {
  const summary = await wikiPage.summary();
  const content = await wikiPage.content();

  return {
    summary,
    content,
  };
};

exports.lambdaHandler = async (event, context) => {
  if (!event || !event.queryStringParameters || !event.queryStringParameters.search) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing search parameter',
      }),
    };
  }

  const search = event.queryStringParameters.search;
  let response;

  try {
    const wikiPage = await wiki()
      .search(search)
      .then((res) => res.results[0])
      .then((name) => wiki().page(name));

    const wikiContent = await getWikiContent(wikiPage);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        ...wikiContent,
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
