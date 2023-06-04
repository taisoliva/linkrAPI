--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Homebrew)
-- Dumped by pg_dump version 14.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: linkr; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE linkr WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--


--
-- Name: users; Type: TABLE; Schema: public; Owner: yokuny
--

CREATE TABLE public.users (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: yokuny
--

CREATE TABLE public.tokens (
    id SERIAL,
    refresh_token TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT tokens_pkey PRIMARY KEY (id),
    CONSTRAINT tokens_refresh_token_key UNIQUE (refresh_token),
    CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: yokuny
--

CREATE TABLE public.posts (
    id SERIAL,
    link VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '0',
    user_id INTEGER NOT NULL,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);


--
-- Name: hashtags; Type: TABLE; Schema: public; Owner: yokuny
--

CREATE TABLE public.hashtags (
    id SERIAL,
    post_id INTEGER NOT NULL,
    hash_name TEXT NOT NULL,
    CONSTRAINT hashtags_pkey PRIMARY KEY (id),
    CONSTRAINT hashtags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);


--
-- Name: likes; Type: TABLE; Schema: public; Owner: yokuny
--

CREATE TABLE public.likes (
    id SERIAL,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    CONSTRAINT likes_pkey PRIMARY KEY (id),
    CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
