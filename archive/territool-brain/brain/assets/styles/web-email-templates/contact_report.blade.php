@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">A user has reported an issue with one or more contacts.</td>
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
	<td colspan="2"><strong>Company</strong></td>
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
<tr>
	<td colspan="2">&nbsp;</td>
</tr>
<tr>
	<td colspan="2"><strong>Reported contacts ({{ count($reportedContacts) }})</strong></td>
</tr>
@foreach ($reportedContacts as $index => $contact)
@if ($index > 0)
<tr>
	<td colspan="2"><hr style="border:0;border-top:1px solid #ddd;margin:12px 0;" /></td>
</tr>
@endif
<tr>
	<td>Name:</td>
	<td>{{ $contact['name'] }}</td>
</tr>
@if (!empty($contact['position']))
<tr>
	<td>Position:</td>
	<td>{{ $contact['position'] }}</td>
</tr>
@endif
@if (!empty($contact['email']))
<tr>
	<td>Email:</td>
	<td>{{ $contact['email'] }}</td>
</tr>
@endif
@if (!empty($contact['mobile_no']))
<tr>
	<td>Mobile:</td>
	<td>{{ $contact['mobile_no'] }}</td>
</tr>
@endif
@if (!empty($contact['phone_no']))
<tr>
	<td>Phone:</td>
	<td>{{ $contact['phone_no'] }}</td>
</tr>
@endif
@if (!empty($contact['linkedin_url']))
<tr>
	<td>LinkedIn:</td>
	<td>{{ $contact['linkedin_url'] }}</td>
</tr>
@endif
@if (!empty($contact['city']) || !empty($contact['state']))
<tr>
	<td>Location:</td>
	<td>{{ trim(($contact['city'] ?? '') . (!empty($contact['city']) && !empty($contact['state']) ? ', ' : '') . ($contact['state'] ?? '')) }}</td>
</tr>
@endif
@endforeach

@endsection
