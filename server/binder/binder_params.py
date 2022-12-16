class BinderParameters:
    def __init__(self,
                 prompt_file='binder/templates/prompts/wikitq_binder.txt',
                 prompt_style='create_table_select_3',
                 generate_type='nsql',
                 n_shots=14,
                 seed=42,
                 engine='code-davinci-002',
                 max_generation_tokens=512,
                 max_api_total_tokens=8001,
                 temperature=0.4,
                 sampling_n=1,
                 top_p=1.0,
                 stop_tokens='\n\n',
                 qa_retrieve_pool_file='templates/qa_retrieve_pool/qa_retrieve_pool.json'
                 ):
        self.prompt_file = prompt_file
        self.prompt_style = prompt_style
        self.generate_type = generate_type
        self.n_shots = n_shots
        self.seed = seed
        self.engine = engine
        self.max_generation_tokens = max_generation_tokens
        self.max_api_total_tokens = max_api_total_tokens
        self.temperature = temperature
        self.sampling_n = sampling_n
        self.top_p = top_p
        self.stop_tokens = stop_tokens
        self.qa_retrieve_pool_file = qa_retrieve_pool_file


DEFAULT_BINDER_PARAMS = BinderParameters()
