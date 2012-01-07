--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.2
-- Dumped by pg_dump version 9.1.2
-- Started on 2012-01-07 01:04:00 EET

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 177 (class 3079 OID 11907)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2205 (class 0 OID 0)
-- Dependencies: 177
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 161 (class 1259 OID 16855)
-- Dependencies: 6
-- Name: badges; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE badges (
    id integer NOT NULL,
    badge_name character varying(256),
    badge_description character varying(1024),
    prerequisite_field character varying(128),
    prerequisite_score integer
);


--
-- TOC entry 162 (class 1259 OID 16861)
-- Dependencies: 6 161
-- Name: badges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE badges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2206 (class 0 OID 0)
-- Dependencies: 162
-- Name: badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE badges_id_seq OWNED BY badges.id;


--
-- TOC entry 163 (class 1259 OID 16863)
-- Dependencies: 2164 6
-- Name: chat_log; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE chat_log (
    id integer NOT NULL,
    sender_id integer,
    recieved boolean DEFAULT false NOT NULL,
    message character varying(2048) NOT NULL,
    reciever_id integer NOT NULL
);


--
-- TOC entry 164 (class 1259 OID 16870)
-- Dependencies: 163 6
-- Name: chat_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE chat_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2207 (class 0 OID 0)
-- Dependencies: 164
-- Name: chat_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE chat_log_id_seq OWNED BY chat_log.id;


--
-- TOC entry 165 (class 1259 OID 16872)
-- Dependencies: 6
-- Name: received_badges; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE received_badges (
    id integer NOT NULL,
    badge_id integer,
    user_id integer
);


--
-- TOC entry 166 (class 1259 OID 16875)
-- Dependencies: 165 6
-- Name: received_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE received_badges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2208 (class 0 OID 0)
-- Dependencies: 166
-- Name: received_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE received_badges_id_seq OWNED BY received_badges.id;


--
-- TOC entry 167 (class 1259 OID 16877)
-- Dependencies: 2167 2168 6
-- Name: survey_answers; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE survey_answers (
    id integer NOT NULL,
    survey_question_id integer NOT NULL,
    answer character varying(2048) NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    user_defined_answer boolean DEFAULT false NOT NULL
);


--
-- TOC entry 168 (class 1259 OID 16885)
-- Dependencies: 167 6
-- Name: survey_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE survey_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2209 (class 0 OID 0)
-- Dependencies: 168
-- Name: survey_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE survey_answers_id_seq OWNED BY survey_answers.id;


--
-- TOC entry 169 (class 1259 OID 16887)
-- Dependencies: 6
-- Name: survey_questions; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE survey_questions (
    id integer NOT NULL,
    survey_id integer NOT NULL,
    answer_type_id integer NOT NULL,
    question character varying(1024),
    template character varying(1024)
);


--
-- TOC entry 170 (class 1259 OID 16893)
-- Dependencies: 169 6
-- Name: survey_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE survey_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2210 (class 0 OID 0)
-- Dependencies: 170
-- Name: survey_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE survey_questions_id_seq OWNED BY survey_questions.id;


--
-- TOC entry 171 (class 1259 OID 16895)
-- Dependencies: 2171 6
-- Name: surveys; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE surveys (
    id integer NOT NULL,
    creator_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    survey_name character varying(1024) NOT NULL,
    slug character varying(1024) NOT NULL
);


--
-- TOC entry 172 (class 1259 OID 16902)
-- Dependencies: 171 6
-- Name: surveys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE surveys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2211 (class 0 OID 0)
-- Dependencies: 172
-- Name: surveys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE surveys_id_seq OWNED BY surveys.id;


--
-- TOC entry 173 (class 1259 OID 16904)
-- Dependencies: 6
-- Name: user_answers; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE user_answers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    survey_id integer NOT NULL,
    survey_answer_id integer NOT NULL,
    survey_answer_plain character varying(1024) NOT NULL
);


--
-- TOC entry 174 (class 1259 OID 16910)
-- Dependencies: 173 6
-- Name: user_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2212 (class 0 OID 0)
-- Dependencies: 174
-- Name: user_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_answers_id_seq OWNED BY user_answers.id;


--
-- TOC entry 175 (class 1259 OID 16912)
-- Dependencies: 2174 2175 2176 2177 6
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    oauth_token character varying(1024),
    created_at date DEFAULT now() NOT NULL,
    login character varying(255),
    password character varying(255),
    email character varying(255),
    user_name character varying(512),
    oauth_token_secret character varying(1024),
    role character varying(128) DEFAULT 'user'::character varying NOT NULL,
    activation_link character varying(1024),
    profile_pic_url character varying(1024),
    blocked boolean DEFAULT false NOT NULL,
    accept_terms boolean DEFAULT false NOT NULL
);


--
-- TOC entry 2213 (class 0 OID 0)
-- Dependencies: 175
-- Name: COLUMN users.oauth_token; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN users.oauth_token IS 'field for custom oauth id''s like twitter id or facebook id';


--
-- TOC entry 176 (class 1259 OID 16922)
-- Dependencies: 6 175
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2214 (class 0 OID 0)
-- Dependencies: 176
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 2163 (class 2604 OID 16924)
-- Dependencies: 162 161
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE badges ALTER COLUMN id SET DEFAULT nextval('badges_id_seq'::regclass);


--
-- TOC entry 2165 (class 2604 OID 16925)
-- Dependencies: 164 163
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE chat_log ALTER COLUMN id SET DEFAULT nextval('chat_log_id_seq'::regclass);


--
-- TOC entry 2166 (class 2604 OID 16926)
-- Dependencies: 166 165
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE received_badges ALTER COLUMN id SET DEFAULT nextval('received_badges_id_seq'::regclass);


--
-- TOC entry 2169 (class 2604 OID 16927)
-- Dependencies: 168 167
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE survey_answers ALTER COLUMN id SET DEFAULT nextval('survey_answers_id_seq'::regclass);


--
-- TOC entry 2170 (class 2604 OID 16928)
-- Dependencies: 170 169
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE survey_questions ALTER COLUMN id SET DEFAULT nextval('survey_questions_id_seq'::regclass);


--
-- TOC entry 2172 (class 2604 OID 16929)
-- Dependencies: 172 171
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE surveys ALTER COLUMN id SET DEFAULT nextval('surveys_id_seq'::regclass);


--
-- TOC entry 2173 (class 2604 OID 16930)
-- Dependencies: 174 173
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE user_answers ALTER COLUMN id SET DEFAULT nextval('user_answers_id_seq'::regclass);


--
-- TOC entry 2178 (class 2604 OID 16931)
-- Dependencies: 176 175
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2180 (class 2606 OID 16933)
-- Dependencies: 161 161
-- Name: badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- TOC entry 2182 (class 2606 OID 16935)
-- Dependencies: 163 163
-- Name: chat_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY chat_log
    ADD CONSTRAINT chat_log_pkey PRIMARY KEY (id);


--
-- TOC entry 2184 (class 2606 OID 16937)
-- Dependencies: 165 165
-- Name: received_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY received_badges
    ADD CONSTRAINT received_badges_pkey PRIMARY KEY (id);


--
-- TOC entry 2187 (class 2606 OID 16939)
-- Dependencies: 167 167
-- Name: survey_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY survey_answers
    ADD CONSTRAINT survey_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 2191 (class 2606 OID 16941)
-- Dependencies: 169 169
-- Name: survey_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY survey_questions
    ADD CONSTRAINT survey_questions_pkey PRIMARY KEY (id);


--
-- TOC entry 2193 (class 2606 OID 16943)
-- Dependencies: 171 171
-- Name: surveys_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY surveys
    ADD CONSTRAINT surveys_pkey PRIMARY KEY (id);


--
-- TOC entry 2195 (class 2606 OID 16945)
-- Dependencies: 173 173
-- Name: user_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY user_answers
    ADD CONSTRAINT user_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 2198 (class 2606 OID 16947)
-- Dependencies: 175 175
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2188 (class 1259 OID 16948)
-- Dependencies: 169
-- Name: fki_answer_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX fki_answer_id ON survey_questions USING btree (answer_type_id);


--
-- TOC entry 2189 (class 1259 OID 16949)
-- Dependencies: 169
-- Name: fki_survey_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX fki_survey_id ON survey_questions USING btree (survey_id);


--
-- TOC entry 2185 (class 1259 OID 16950)
-- Dependencies: 167
-- Name: fki_survey_question_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX fki_survey_question_id ON survey_answers USING btree (survey_question_id);


--
-- TOC entry 2196 (class 1259 OID 16951)
-- Dependencies: 175
-- Name: users_oauth_id_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX users_oauth_id_idx ON users USING btree (oauth_token);


--
-- TOC entry 2199 (class 2606 OID 16952)
-- Dependencies: 169 2192 171
-- Name: fk_survey_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY survey_questions
    ADD CONSTRAINT fk_survey_id FOREIGN KEY (survey_id) REFERENCES surveys(id);


--
-- TOC entry 2204 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2012-01-07 01:04:00 EET

--
-- PostgreSQL database dump complete
--

