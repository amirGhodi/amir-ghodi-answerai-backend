const { Anthropic } = require('@anthropic-ai/sdk');
const{ ANTHROPIC_API_KEY } = require('../config');

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY 
});

exports.generateAnswer = async(question)  => {
  const message = await anthropic.messages.create({
    max_tokens: 30,
    messages: [{ role: 'user', content: question }],
    model: 'claude-3-opus-20240229',
  });

  console.log(message.content[0].text);
  return message.content[0].text;
}