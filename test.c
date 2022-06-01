int	ft_printfl(const char *input, ...)
{
	va_list	args;
	size_t	output_str_len;
	char	*final_str;

	va_start(args, input);
	final_str = ft_strjoin(input, "\n");
	output_str_len = ft_print(final_str, args);
	ft_safe_free(final_str);
	va_end(args);
	return (output_str_len);
}

struct t_list	*ft_printf_parse_args(va_list args, char *input)
{
	t_list			*list;
	size_t			i;
	t_template_type	type;
	int				should_free_arg;

	return (list);
}
