t_link* ft_map_formatted_to_str (t_link* elem)
{
	if (!elem || !elem->data || !elem->data->value) return (NULL);
	t_formatted_element* curr = elem->data->value;
	t_link* new = new_link();
	new->set_data(new, new_typed_ptr_str(ft_strdup(curr->value)));
	return (new);
}



-----------------------------------------


t_link	*ft_map_formatted_to_str(t_link *elem)
{
	t_formatted_element	*curr;
	t_link				*new;

	if (!elem || !elem->data || !elem->data->value)
		return (NULL);
	curr = elem->data->value;
	new = new_link();
	new->set_data(new, new_typed_ptr_str(ft_strdup(curr->value)));
	return (new);
}

