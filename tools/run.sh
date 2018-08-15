curl -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
     -H "Content-Type: application/json; charset=utf-8" --data "{
  'query_input': {
    'text': {
      'text': 'reserve a meeting room for six people',
      'language_code': 'en-US'
    }
  },
  'query_params': {
    'payload': {
        'data': {'foo': 'bar'}
    }
  }
}" "https://dialogflow.googleapis.com/v2/projects/catcatchatbot/agent/sessions/123456789:detectIntent"
