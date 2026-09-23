@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear {{ $demo->name }},</td>
</tr>
<tr>
	<td colspan="2">Your business account has been created successfully.</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
<tr>
	<td colspan="2" style="background: #595959; color: #ffffff; padding: 10px; line-height: 20px;">Here are your account details:</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Registered Email:</td>
	<td>{{ $demo->email }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Number Of License(s):</td>
	<td>{{ $demo->amount_of_licenses }}</td>
</tr>
<tr>
	<td style="background: #f9f9f9; color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Cost Per User: </td>
	<td style="background: #f9f9f9; color: #666666; padding: 10px;  line-height: 20px;">{{ $demo->cost_per_user }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Payment Period: </td>
	<td>{{ ucfirst($demo->payment_period) }}</td>
</tr>
<tr>
	<td style="background: #f9f9f9; color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Total Cost({{ ucfirst($demo->payment_period) }}):</td>
	<td style="background: #f9f9f9; color: #666666; padding: 10px;  line-height: 20px;">{{ $demo->amount_of_licenses * $demo->cost_per_user }} </td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Billing Name:</td>
	<td>{{ $demo->billing_name }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Billing Email:</td>
	<td>{{ $demo->billing_email }}</td>
</tr>
<tr>
	<td colspan="2">Click the button below to activate your account and set your password.</td>
</tr>
<tr>
	<td colspan="2" align="center"><a href="{{ URL::to('/') }}/accActivate/{{ $demo->id }}" style=" background:#124AC6; padding: 10px 15px; font-size: 14px; font-weight: bold; border-radius: 10px; color: #ffffff; text-decoration: none; ">Activate Profile</a>
	</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
<tr>
	<td colspan="2" align="center">If you have any issues with the link above, please contact <a href="mailto:spencer@teritool.com" target="_blank">spencer@teritool.com</a></td>
</tr>
            
@endsection