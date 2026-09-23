@extends('mails.layout')
@section('body')


<tr>
	<td colspan="2">Hi {{$demo->name}},</td>
</tr>
<tr>
    <td colspan="2">Thank you for subscribing to TerriTool’s “lead finder” package.</td>
</tr>
<tr>
    <td colspan="2">With your subscription, you’ll have access to our “find leads” feature alongside 100 lead credits
        per month. Unused credits with rollover to the next month.</td>
</tr>
<tr>
    <td colspan="2">If you go over your allotment, you will be charged 40 cents per lead.</td>
</tr>
<tr>
    <td colspan="2">Contact <a href="mailto: billing@territool.com">billing@territool.com</a> with any questions.</td>
</tr>

@endsection