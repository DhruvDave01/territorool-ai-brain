@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">A user has reported an issue with a company.</td>
</tr>
<tr>
	<td>Reported by:</td>
	<td>{{ $reporter->name }} ({{ $reporter->email }})</td>
</tr>
<tr>
	<td>Reason:</td>
	<td>{{ $reasonLabel }}</td>
</tr>
@if (!empty($details))
<tr>
	<td>Additional details:</td>
	<td>{{ $details }}</td>
</tr>
@endif
<tr>
	<td colspan="2">&nbsp;</td>
</tr>
<tr>
	<td colspan="2"><strong>Reported company</strong></td>
</tr>
<tr>
	<td>ID:</td>
	<td>{{ $company->id }}</td>
</tr>
<tr>
	<td>Name:</td>
	<td>{{ $company->title }}</td>
</tr>
@if (!empty($company->address))
<tr>
	<td>Address:</td>
	<td>{{ $company->address }}</td>
</tr>
@endif
@if (!empty($company->phone_number))
<tr>
	<td>Phone:</td>
	<td>{{ $company->phone_number }}</td>
</tr>
@endif
@if (!empty($company->website))
<tr>
	<td>Website:</td>
	<td>{{ $company->website }}</td>
</tr>
@endif
@if (!empty($company->company_email))
<tr>
	<td>Email:</td>
	<td>{{ $company->company_email }}</td>
</tr>
@endif
@if (!empty($company->type))
<tr>
	<td>Industry:</td>
	<td>{{ $company->type }}</td>
</tr>
@endif

@endsection
